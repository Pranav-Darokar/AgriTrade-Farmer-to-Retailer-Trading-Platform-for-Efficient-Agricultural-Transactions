package com.farmtrade.backend.component;

import com.farmtrade.backend.model.Product;
import com.farmtrade.backend.model.Role;
import com.farmtrade.backend.model.User;
import com.farmtrade.backend.model.UserStatus;
import com.farmtrade.backend.repository.ProductRepository;
import com.farmtrade.backend.repository.UserRepository;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

        @Autowired
        UserRepository userRepository;

        @Autowired
        ProductRepository productRepository;

        @Autowired
        PasswordEncoder encoder;

        @Override
        public void run(String... args) throws Exception {
                // Check if admin exists
                if (!userRepository.existsByEmail("admin@farmtrade.com")) {
                        User admin = new User();
                        admin.setEmail("admin@farmtrade.com");
                        admin.setPassword(encoder.encode("admin123"));
                        admin.setFullName("Super Admin");
                        admin.setRole(Role.ADMIN);
                        admin.setStatus(UserStatus.APPROVED);
                        admin.setMobileNumber("0000000000");
                        admin.setAddress("Admin HQ");

                        userRepository.save(admin);
                        System.out.println("Admin user seeded: admin@farmtrade.com / admin123");
                }

                // Check if a farmer exists for seeding
                User farmer = userRepository.findByEmail("farmer@farmtrade.com").orElse(null);
                if (farmer == null) {
                        farmer = new User();
                        farmer.setEmail("farmer@farmtrade.com");
                        farmer.setPassword(encoder.encode("farmer123"));
                        farmer.setFullName("Ramesh Kumar");
                        farmer.setRole(Role.FARMER);
                        farmer.setStatus(UserStatus.APPROVED);
                        farmer.setMobileNumber("9876543210");
                        farmer.setAddress("Green Valley Farms, Punjab");
                        userRepository.save(farmer);
                        System.out.println("Farmer user seeded: farmer@farmtrade.com / farmer123");
                }

                // Check if a retailer exists for seeding
                if (!userRepository.existsByEmail("retailer@farmtrade.com")) {
                        User retailer = new User();
                        retailer.setEmail("retailer@farmtrade.com");
                        retailer.setPassword(encoder.encode("retailer123"));
                        retailer.setFullName("Pranav Stores");
                        retailer.setRole(Role.RETAILER);
                        retailer.setStatus(UserStatus.APPROVED);
                        retailer.setMobileNumber("8888888888");
                        retailer.setAddress("Main Market, Mumbai");
                        retailer.setLicenceNumber("RT-12345");
                        userRepository.save(retailer);
                        System.out.println("Retailer user seeded: retailer@farmtrade.com / retailer123");
                }

                // Seed Premium Products if marketplace is empty
                if (productRepository.count() == 0) {
                        seedPremiumProducts(farmer);
                }
        }

        private void seedPremiumProducts(User farmer) {
                List<Product> products = Arrays.asList(
                                // Grains & Pulses
                                createProduct("Basmati Rice",
                                                "Sun-kissed long grains, aged to perfection for that iconic aroma.",
                                                180,
                                                "Kg", "Grains & Pulses",
                                                "https://img.freepik.com/free-photo/raw-rice-white-bowl_1150-17684.jpg",
                                                farmer),
                                createProduct("Golden Moong Dal",
                                                "Double-polished, high-protein moong dal from the heart of Madhya Pradesh.",
                                                145, "Kg",
                                                "Grains & Pulses",
                                                "https://img.freepik.com/free-photo/raw-mung-beans-wooden-bowl_1150-18451.jpg",
                                                farmer),
                                createProduct("Pearl Millets (Bajra)",
                                                "Indigenous ancient grains, slow-dried in the Rajasthan sun.",
                                                65, "Kg", "Grains & Pulses",
                                                "https://img.freepik.com/free-photo/raw-millet-wooden-bowl_1150-18449.jpg",
                                                farmer),
                                createProduct("Red Kidney Beans", "Hand-sorted Rajma from the foothills of Jammu.", 160,
                                                "Kg",
                                                "Grains & Pulses",
                                                "https://img.freepik.com/free-photo/top-view-red-kidney-beans-wooden-bowl_1150-18456.jpg",
                                                farmer),
                                createProduct("Whole Brown Lentils",
                                                "Earth-rich Masoor Dal, packed with natural flavor and fiber.", 95,
                                                "Kg", "Grains & Pulses",
                                                "https://img.freepik.com/free-photo/raw-brown-lentils-wooden-bowl_1150-18453.jpg",
                                                farmer),

                                // Fresh Vegetables
                                createProduct("Organic Spinach", "Crisp, iron-rich leaves picked at the crack of dawn.",
                                                40, "Bunch",
                                                "Fresh Vegetables",
                                                "https://img.freepik.com/free-photo/fresh-spinach-leaves_1150-18507.jpg",
                                                farmer),
                                createProduct("Heirloom Tomatoes",
                                                "Juicy, vine-ripened tomatoes with a deep, natural sweetness.", 60,
                                                "Kg", "Fresh Vegetables",
                                                "https://img.freepik.com/free-photo/fresh-tomatoes_1150-18512.jpg",
                                                farmer),
                                createProduct("Farm-Fresh Carrots",
                                                "Sweet, crunchy Ooty carrots, straight from the red soil.", 55,
                                                "Kg", "Fresh Vegetables",
                                                "https://img.freepik.com/free-photo/fresh-carrots_1150-18509.jpg",
                                                farmer),
                                createProduct("Bell Peppers",
                                                "Vibrant and crunchy peppers, greenhouse-grown for premium quality.",
                                                120,
                                                "Kg", "Fresh Vegetables",
                                                "https://img.freepik.com/free-photo/colorful-bell-peppers_1150-18515.jpg",
                                                farmer),
                                createProduct("Broccoli Florets", "Premium, dense florets rich in antioxidants.", 90,
                                                "Unit",
                                                "Fresh Vegetables",
                                                "https://img.freepik.com/free-photo/fresh-broccoli_1150-18518.jpg",
                                                farmer),

                                // Dairy
                                createProduct("Pure Cow Ghee",
                                                "Traditional Bilona ghee, crafted from the milk of grass-fed cows.",
                                                850,
                                                "Kg", "Dairy",
                                                "https://img.freepik.com/free-photo/ghee-bowl_1150-18524.jpg", farmer),
                                createProduct("Artisanal Paneer", "Soft, melt-in-the-mouth cottage cheese made daily.",
                                                380, "Kg",
                                                "Dairy",
                                                "https://img.freepik.com/free-photo/paneer-cubes_1150-18526.jpg",
                                                farmer),
                                createProduct("Farm Fresh Milk", "Pure, unadulterated milk from happy, healthy cattle.",
                                                75, "Litre",
                                                "Dairy", "https://img.freepik.com/free-photo/fresh-milk_1150-18521.jpg",
                                                farmer),
                                createProduct("Thick Set Curd", "Creamy, probiotic curd set in traditional clay pots.",
                                                50, "Cup",
                                                "Dairy",
                                                "https://img.freepik.com/free-photo/fresh-yogurt_1150-18528.jpg",
                                                farmer),

                                // Essentials
                                createProduct("Himalayan Pink Salt",
                                                "Pristine salt crystals, rich in 84 natural minerals.", 90, "Kg",
                                                "Essentials",
                                                "https://img.freepik.com/free-photo/pink-salt_1150-18531.jpg", farmer),
                                createProduct("Mustard Oil",
                                                "Cold-pressed, pungent mustard oil for an authentic Indian kitchen.",
                                                210,
                                                "Litre", "Essentials",
                                                "https://img.freepik.com/free-photo/mustard-oil_1150-18534.jpg",
                                                farmer),
                                createProduct("Wild Forest Honey",
                                                "Raw, unprocessed honey harvested from the deep forests.", 450, "Kg",
                                                "Essentials",
                                                "https://img.freepik.com/free-photo/fresh-honey_1150-18536.jpg",
                                                farmer),
                                createProduct("Organic Jaggery",
                                                "Chemical-free jaggery blocks, a natural sweet legacy.", 120, "Kg",
                                                "Essentials",
                                                "https://img.freepik.com/free-photo/jaggery-blocks_1150-18539.jpg",
                                                farmer),

                                // Fruits
                                createProduct("Alphonso Mangoes",
                                                "The king of fruits, handpicked from the Ratnagiri orchards.", 1200,
                                                "Dozen", "Fruits",
                                                "https://img.freepik.com/free-photo/alphonso-mangoes_1150-18542.jpg",
                                                farmer),
                                createProduct("Kashmiri Apples",
                                                "Crisp, sweet, and blushing red from the valley of Kashmir.", 180,
                                                "Kg", "Fruits",
                                                "https://img.freepik.com/free-photo/red-apples_1150-18545.jpg", farmer),
                                createProduct("Nagpur Oranges", "Juicy, thin-skinned oranges bursting with vitamin C.",
                                                90, "Kg",
                                                "Fruits",
                                                "https://img.freepik.com/free-photo/fresh-oranges_1150-18548.jpg",
                                                farmer),
                                createProduct("Pomegranates", "Premium ruby-red seeds, high in nutrition and taste.",
                                                220, "Kg",
                                                "Fruits",
                                                "https://img.freepik.com/free-photo/fresh-pomegranates_1150-18551.jpg",
                                                farmer));
                productRepository.saveAll(products);
                System.out.println("22 Premium products seeded successfully!");
        }

        private Product createProduct(String name, String desc, double price, String unit, String category, String url,
                        User farmer) {
                Product p = new Product();
                p.setName(name);
                p.setDescription(desc);
                p.setPrice(BigDecimal.valueOf(price));
                p.setUnit(unit);
                p.setCategory(category);
                p.setImageUrl(url);
                p.setQuantity(100);
                p.setFarmer(farmer);
                return p;
        }
}
