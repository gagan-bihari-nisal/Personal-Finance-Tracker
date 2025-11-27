package com.pft.auth_service.service;

import com.pft.auth_service.dto.ErrorResponse;
import com.pft.auth_service.exception.DuplicateResourceException;
import com.pft.auth_service.exception.ResourceNotFoundException;
import com.pft.auth_service.model.User;
import com.pft.auth_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService implements UserDetailsService {
	
	@Autowired
	UserRepository userRepo;
	
	@Autowired
	PasswordEncoder passwordEncoder;
	
	public User registerUser(User user) {
		if (userRepo.existsByUsername(user.getUsername())) {
			throw new DuplicateResourceException("Username '" + user.getUsername() + "' is already taken.");
		}
		if (userRepo.existsByEmail(user.getEmail())) {
			throw new DuplicateResourceException("Email '" + user.getEmail() + "' is already registered.");
		}
		
		User userDao = new User();
		userDao.setEmail(user.getEmail());
		userDao.setUsername(user.getUsername());
		userDao.setPassword(passwordEncoder.encode(user.getPassword()));
		
		return userRepo.save(userDao);
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Optional<User> user = userRepo.findByUsername(username);
		
		List<GrantedAuthority> authorities = new ArrayList<>();
		
		if (user.isPresent()) {
			authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
			return new org.springframework.security.core.userdetails.User(user.get().getUsername(),user.get().getPassword(), authorities);
		} else {
			throw new UsernameNotFoundException(username + " is not found");
		}
	}

	public Map<String, String> getUserByUsername(String username) {
		return userRepo.findByUsername(username)
				.map(user -> {
					Map<String, String> userMap = new HashMap<>();
					userMap.put("username", user.getUsername());
					userMap.put("email", user.getEmail());
					return userMap;
				})
				.orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
	}


}