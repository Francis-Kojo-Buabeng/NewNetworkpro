package com.networkpro.features.authentication.service;

import com.networkpro.features.authentication.dto.AuthenticationRequestBody;
import com.networkpro.features.authentication.dto.AuthenticationResponseBody;
import com.networkpro.features.authentication.model.AuthenticationUser;
import com.networkpro.features.authentication.repository.AuthenticationUserRepository;
import com.networkpro.features.authentication.utils.EmailService;
import com.networkpro.features.authentication.utils.Encoder;
import com.networkpro.features.authentication.utils.JsonWebToken;
import jakarta.mail.MessagingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.io.UnsupportedEncodingException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthenticationService {

    private final JsonWebToken jsonWebToken;
    private final Encoder encoder;
    private final AuthenticationUserRepository authenticationUserRepository;
    private final EmailService emailService;

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);
    private final int durationInMinutes = 1;

    public AuthenticationService(JsonWebToken jsonWebToken, Encoder encoder, AuthenticationUserRepository authenticationUserRepository, EmailService emailService) {
        this.jsonWebToken = jsonWebToken;
        this.encoder = encoder;
        this.authenticationUserRepository = authenticationUserRepository;
        this.emailService = emailService;
    }

    public static String generateEmailVerificationToken() {
        SecureRandom random = new SecureRandom();
        StringBuilder token = new StringBuilder(5);
        for (int i = 0; i < 5; i++) {
            token.append(random.nextInt(10));
        }
        return token.toString();
    }

    public void sendEmailVerificationToken(String email) {
        Optional<AuthenticationUser> user = authenticationUserRepository.findByEmail(email);
        if (user.isPresent() && !user.get().getEmailVerified()) {
            String emailVerificationToken = generateEmailVerificationToken();
            String hashedToken = encoder.encode(emailVerificationToken);
            user.get().setEmailVerificationToken(hashedToken);
            user.get().setEmailVerificationTokenExpiryDate(LocalDateTime.now().plusMinutes(durationInMinutes));
            authenticationUserRepository.save(user.get());
            String subject = "Email Verification";
            String body = String.format("Only one step to take full advantage of Networkpro.\n\n"
            + "Enter this code to verify you email: "
            + "%s\n\n" + "The code will expire in " + "%s" + " minutes.",
            emailVerificationToken, durationInMinutes);

            try{
                emailService.sendEmail(email, subject, body);
            }catch (Exception e){
                logger.info("Error while sending email: {}", e.getMessage());
            }
        } else {
            throw new IllegalArgumentException("Email verification token expired, or email is already verified");
        }
    }

    public void validateEmailVerificationToken(String token, String email) {
        Optional<AuthenticationUser> user = authenticationUserRepository.findByEmail(email);
        if (user.isPresent() && encoder.matches(token, user.get().getEmailVerificationToken()) && !user.get().getEmailVerificationTokenExpiryDate().isBefore(LocalDateTime.now())) {
            user.get().setEmailVerified(true);
            user.get().setEmailVerificationToken(null);
            user.get().setEmailVerificationTokenExpiryDate(null);
            authenticationUserRepository.save(user.get());

        }else if (user.isPresent() && encoder.matches(token, user.get().getEmailVerificationToken()) && user.get().getEmailVerificationTokenExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Email verification token expired.");
        }else {
            throw new IllegalArgumentException("Email verification token failed.");
        }

    }

    public AuthenticationUser getUser(String email){
        return authenticationUserRepository.findByEmail(email).orElseThrow(()-> new IllegalAccessError("User not found"));

    }


    public AuthenticationResponseBody login( AuthenticationRequestBody registerRequestBody) {
        AuthenticationUser user = authenticationUserRepository.findByEmail(registerRequestBody.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("User not found. Please sign up first."));

        if(!encoder.matches(registerRequestBody.getPassword(), user.getPassword())){
            throw new IllegalArgumentException("Passwords is incorrect");
        }

        String token = jsonWebToken.generateToken(registerRequestBody.getEmail());
        return new AuthenticationResponseBody(token,"Authentication Succeeded");
    }


    public AuthenticationResponseBody register(AuthenticationRequestBody registerRequestBody) throws MessagingException, UnsupportedEncodingException {
        // Check if email already exists
        if (authenticationUserRepository.findByEmail(registerRequestBody.getEmail()).isPresent()) {
            throw new IllegalArgumentException("An account with this email already exists. Please use a different email or sign in.");
        }
        AuthenticationUser user = authenticationUserRepository.save(new AuthenticationUser(registerRequestBody.getEmail(), encoder.encode(registerRequestBody.getPassword())));

        String emailVerificationToken = generateEmailVerificationToken();
        String hashedToken = encoder.encode(emailVerificationToken);
        user.setEmailVerificationToken(hashedToken);
        user.setEmailVerificationTokenExpiryDate(LocalDateTime.now().plusMinutes(durationInMinutes));

        authenticationUserRepository.save(user);

        String subject = "Email Verification";
        String body = String.format("""
                Only one step to take full advantage of Networkpro.
            
                Enter this code to verify your email: %s. The code will expire in %s minutes. """,

                emailVerificationToken, durationInMinutes);

        try{
            emailService.sendEmail(registerRequestBody.getEmail(), subject, body);

        }catch (Exception e){
            logger.info("Error while sending email: {}", e.getMessage());
        }

        String token = jsonWebToken.generateToken(registerRequestBody.getEmail());
        return new AuthenticationResponseBody(token, "User registered successfully ");
    }


    public void sendPasswordResetToken(String email) {
        // Look for the user by their email in the database
        Optional<AuthenticationUser> user = authenticationUserRepository.findByEmail(email);

        // If the user exists
        if (user.isPresent()) {

            // Generate a random 5-digit numeric token (e.g., "82347")
            String passwordResetToken = generateEmailVerificationToken();

            // Hash the token for secure storage in the database
            String hashedToken = encoder.encode(passwordResetToken);

            // Save the hashed token and its expiry time (e.g., 10 minutes from now)
            user.get().setPasswordResetToken(hashedToken);
            user.get().setPasswordResetTokenExpirationDate(LocalDateTime.now().plusMinutes(durationInMinutes));

            // Update the user record with the new token
            authenticationUserRepository.save(user.get());

            // Prepare the email content
            String subject = "Password Reset";
            String body = String.format("""
            You requested a password reset.

            Enter this code to reset your Password: %s. The code will expire in %s minutes.""",
                    passwordResetToken, durationInMinutes);

            try {
                // Send the email with the token to the user
                emailService.sendEmail(email, subject, body);
            } catch (Exception e) {
                // Log any errors that happen during email sending
                logger.info("Error while sending email: {}", e.getMessage());
            }

        } else {
            // If no user was found with the given email, throw an error
            throw new IllegalArgumentException("User not found.");
        }
    }



    public void resetPassword(String email, String newPassword, String token) {
        Optional<AuthenticationUser> userOptional = authenticationUserRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("User not found.");
        }

        AuthenticationUser user = userOptional.get();

        // Check if token is expired
        if (user.getPasswordResetTokenExpirationDate() == null ||
                user.getPasswordResetTokenExpirationDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Password token expired.");
        }

        // Check if token matches
        if (!encoder.matches(token, user.getPasswordResetToken())) {
            throw new IllegalArgumentException("Password token failed.");
        }

        // Token is valid and not expired – proceed
        user.setPassword(encoder.encode(newPassword));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpirationDate(null);

        authenticationUserRepository.save(user);
    }


}
