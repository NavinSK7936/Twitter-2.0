package org.arpit.java2blog.bean;

import java.io.Serializable;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Mention implements Serializable {
    
	private static final long serialVersionUID = 1005436903829146221L;

    private int user_id;
    private String user_name;
    private String mention_name;
    private boolean is_following;

    public Mention() {
    }

    public Mention(int user_id, String user_name, String mention_name, boolean is_following) {
        this.user_id = user_id;
        this.user_name = user_name;
        this.mention_name = mention_name;
        this.is_following = is_following;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }

    public String getMention_name() {
        return mention_name;
    }

    public void setMention_name(String mention_name) {
        this.mention_name = mention_name;
    }

    public boolean isIs_following() {
        return is_following;
    }

    public void setIs_following(boolean is_following) {
        this.is_following = is_following;
    }

}
