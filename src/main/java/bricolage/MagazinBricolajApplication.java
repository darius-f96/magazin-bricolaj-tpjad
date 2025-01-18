package bricolage;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ComponentScan("bricolage")
@EnableScheduling
public class MagazinBricolajApplication {

	public static void main(String[] args) {
		SpringApplication.run(MagazinBricolajApplication.class, args);
	}

}
