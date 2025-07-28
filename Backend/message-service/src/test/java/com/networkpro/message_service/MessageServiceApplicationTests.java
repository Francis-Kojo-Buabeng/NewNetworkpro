package com.networkpro.message_service;

import com.networkpro.message_service.dto.MessageRequestDTO;
import com.networkpro.message_service.service.MessageService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
public class MessageServiceApplicationTests {
	@Autowired
	private MessageService messageService;

	@Test
	void testSendAndGetMessage() {
		MessageRequestDTO request = new MessageRequestDTO();
		request.setSenderId(1L);
		request.setReceiverId(2L);
		request.setContent("Hello!");
		var response = messageService.sendMessage(request);
		Assertions.assertNotNull(response.getId());
		var fetched = messageService.getMessageById(response.getId());
		Assertions.assertEquals("Hello!", fetched.getContent());
	}
}
