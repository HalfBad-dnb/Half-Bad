package com.Pirk.Pirk.Controllers;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ErrorController {

    @GetMapping("/error")
    public String handleError(Model model) {
        // You can add more details to the model if needed
        model.addAttribute("error", "An unexpected error occurred!");
        return "error";  // Returns the error.html page
    }
}
