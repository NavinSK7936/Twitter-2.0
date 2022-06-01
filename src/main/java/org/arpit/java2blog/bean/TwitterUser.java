package org.arpit.java2blog.bean;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class TwitterUser implements Serializable {

	private static final long serialVersionUID = -7230037423352970381L;
	
	private int id;  
	private String user_name;
	private String password;
	private int age;
	private String gender;
	private String phone;
	private String email;
	private String status;
	private int total_tweets;
	private int total_followers;
	private int total_followees;
	private Timestamp created_at;
	private String mention_name;

	public TwitterUser() {
	}
	
	public TwitterUser(int id, String user_name, String password, int age, String gender, String phone, String email,
			String status, int total_tweets, int total_followers, int total_followees, String mention_name) {
		super();
		this.id = id;
		this.user_name = user_name;
		this.password = password;
		this.age = age;
		this.gender = gender;
		this.phone = phone;
		this.email = email;
		this.status = status;
		this.total_tweets = total_tweets;
		this.total_followers = total_followers;
		this.total_followees = total_followees;
		this.created_at = new Timestamp(System.currentTimeMillis());
		this.mention_name = mention_name;
	}
	
	public TwitterUser(int id, String user_name, String password, int age, String gender, String phone, String email,
			String status, int total_tweets, int total_followers, int total_followees, Timestamp created_at, String mention_name) {
		super();
		this.id = id;
		this.user_name = user_name;
		this.password = password;
		this.age = age;
		this.gender = gender;
		this.phone = phone;
		this.email = email;
		this.status = status;
		this.total_tweets = total_tweets;
		this.total_followers = total_followers;
		this.total_followees = total_followees;
		this.created_at = created_at;
		this.mention_name = mention_name;
	}
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getUser_name() {
		return user_name;
	}
	public void setUser_name(String user_name) {
		this.user_name = user_name;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public int getTotal_tweets() {
		return total_tweets;
	}
	public void setTotal_tweets(int total_tweets) {
		this.total_tweets = total_tweets;
	}
	public int getTotal_followers() {
		return total_followers;
	}
	public void setTotal_followers(int total_followers) {
		this.total_followers = total_followers;
	}
	public int getTotal_followees() {
		return total_followees;
	}
	public void setTotal_followees(int total_followees) {
		this.total_followees = total_followees;
	}
	public Timestamp getCreated_at() {
		return created_at;
	}
	public void setCreated_at(Timestamp created_at) {
		this.created_at = created_at;
	}
	public String getMention_name() {
		return mention_name;
	}
	public void setMention_name(String mention_name) {
		this.mention_name = mention_name;
	}
}
