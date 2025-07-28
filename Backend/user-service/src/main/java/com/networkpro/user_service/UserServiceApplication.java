package com.networkpro.user_service;

import com.networkpro.user_service.model.UserProfile;
import com.networkpro.user_service.repository.UserProfileRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class UserServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(UserServiceApplication.class, args);
	}

	@Bean
	public WebMvcConfigurer webMvcConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addResourceHandlers(ResourceHandlerRegistry registry) {
				// Serve profile pictures
				registry.addResourceHandler("/profile-pictures/**")
						.addResourceLocations("file:uploads/profile-pictures/");

				// Serve banner images
				registry.addResourceHandler("/banner-images/**")
						.addResourceLocations("file:uploads/banner-images/");
			}
		};
	}

	@Bean
	public org.springframework.boot.CommandLineRunner addDefaultUser(UserProfileRepository userProfileRepository) {
		return args -> {
			String defaultEmail = "test@example.com";
			boolean userExists = userProfileRepository.existsByEmail(defaultEmail);
			if (!userExists) {
				UserProfile user = UserProfile.builder()
						.email(defaultEmail)
						.fullName("Test User")
						.bio("This is a default test user.")
						.location("Test City")
						.currentPosition("Software Developer")
						.currentCompany("Test Company")
						.industry("Technology")
						.headline("Experienced Software Developer")
						.profilePublic(true)
						.contactInfoPublic(true)
						.workExperiencePublic(true)
						.educationPublic(true)
						.skillsPublic(true)
						.build();
				userProfileRepository.save(user);
				System.out.println("Default user created with email: " + defaultEmail);
			} else {
				System.out.println("Default user already exists with email: " + defaultEmail);
			}
		};
	}
}
