package com.Pirk.Pirk.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/beats")
@CrossOrigin(origins = "http://localhost:5173")  // Allow your frontend port
public class BeatController {

    @GetMapping
    public List<Beat> getBeats() {
        return List.of(
            new Beat(1, "Trumpet Beat", 19.99, "/beatsWav/trumpet beat.wav"),
            new Beat(2, "Eminem - Fuel (feat. JID)", 24.99, "/beatsWav/Eminem - Fuel (feat. JID) [Official Audio].mp3")
        );
    }

    static class Beat {
        public int id;
        public String title;
        public double price;
        public String audio;

        public Beat(int id, String title, double price, String audio) {
            this.id = id;
            this.title = title;
            this.price = price;
            this.audio = audio;
        }
    }
}
