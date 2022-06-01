package org.arpit.java2blog;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import com.spacenine.twitter.TwitterHashtagManipulator;

import org.arpit.java2blog.service.TwitterService;

public class MyServletContextListener implements ServletContextListener {
  
    @Override
    public void contextInitialized(ServletContextEvent arg0) {

        System.out.println("Hi!!! Server Started!!!");

        new TwitterHashtagManipulator(new TwitterService()).start();

    }

    @Override
    public void contextDestroyed(ServletContextEvent arg0) {

        System.out.println("Ok Bye!!! Server Closed!!!");

    }
  
  }