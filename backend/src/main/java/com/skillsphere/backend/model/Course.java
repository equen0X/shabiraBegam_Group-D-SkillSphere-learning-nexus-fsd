package com.skillsphere.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String image;

    @Column(name = "is_premium", nullable = false)
    private Boolean isPremium = false;

    @Column(nullable = false)
    private Integer price = 0;

    @Column(nullable = false)
    private String language = "English";

    @Column(nullable = false)
    private String rating = "4.5";

    @Column(nullable = false)
    private String reviews = "1K+";

    @Column(length = 2000)
    private String description;

    @Column(name = "xp_reward", nullable = false)
    private Integer xpReward = 100;

    public Course() {}

    public Course(String title, String image, Boolean isPremium, Integer price, String language, String rating, String reviews, String description) {
        this.title = title;
        this.image = image;
        this.isPremium = isPremium;
        this.price = price;
        this.language = language;
        this.rating = rating;
        this.reviews = reviews;
        this.description = description;
        this.xpReward = 100;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Boolean getIsPremium() {
        return isPremium;
    }

    public void setIsPremium(Boolean premium) {
        isPremium = premium;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public String getReviews() {
        return reviews;
    }

    public void setReviews(String reviews) {
        this.reviews = reviews;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getXpReward() {
        return xpReward;
    }

    public void setXpReward(Integer xpReward) {
        this.xpReward = xpReward;
    }
}
