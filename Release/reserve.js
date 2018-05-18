// Command line args: <abbreviated date> <username> <password> <room> <start time 1> <start time 2> <end time 1> <end time 2>
var webdriver = require('selenium-webdriver');

var driver = new webdriver.Builder().forBrowser('chrome').build();
driver.manage().window().maximize();

var args = process.argv.slice(2);

// Navigate to UNC reserve room

var link = "https://rooms.lib.ncsu.edu/reservation/schedule/0/1/" + args[0];
driver.get(link);

driver.wait(webdriver.until.elementLocated(webdriver.By.id('username')));
driver.findElement(webdriver.By.id('username')).sendKeys(args[1]);
driver.findElement(webdriver.By.id('password')).sendKeys(args[2]);
driver.findElement(webdriver.By.id("formSubmit")).click();

// Confirmation page
driver.wait(webdriver.until.elementLocated(webdriver.By.name('_eventId_proceed')));
driver.findElement(webdriver.By.name('_eventId_proceed')).click();

// Time slot 1
driver.wait(webdriver.until.elementLocated(webdriver.By.xpath("//a[@class='possibleReservation' and @title='Reserve "+args[3]+" starting at "+args[4]+"']")), 500).then(function(elm) {
        selectElem = driver.findElement(webdriver.By.xpath("//a[@class='possibleReservation' and @title='Reserve "+args[3]+" starting at "+args[4]+"']"));
		driver.executeScript("arguments[0].scrollIntoView(false)", selectElem);
		driver.sleep(400);
		selectElem.click();
        handleConfirm(args[6]);
        
		driver.sleep(1000);
		driver.wait(webdriver.until.elementLocated(webdriver.By.xpath("//a[@class='possibleReservation' and @title='Reserve "+args[3]+" starting at "+args[5]+"']")));
		selectElem = driver.findElement(webdriver.By.xpath("//a[@class='possibleReservation' and @title='Reserve "+args[3]+" starting at "+args[5]+"']"));
		driver.executeScript("arguments[0].scrollIntoView(false)", selectElem);
		driver.sleep(400);
		selectElem.click();

		// Close extra glitch box
		driver.wait(webdriver.until.elementLocated(webdriver.By.id("popup-title")));
		selectElem = driver.findElement(webdriver.By.id("popup-title"));
		driver.executeScript("arguments[0].scrollIntoView(false)", selectElem);
		driver.sleep(400);
		driver.wait(webdriver.until.elementLocated(webdriver.By.id("close-pop")));
		driver.findElement(webdriver.By.id("close-pop")).click();
    }).catch(function(ex) {
        //callback(false);
        //driver.quit();
    });

// Time slot 2
driver.sleep(400);
driver.wait(webdriver.until.elementLocated(webdriver.By.xpath("//a[@class='possibleReservation' and @title='Reserve "+args[3]+" starting at "+args[5]+"']")));
selectElem = driver.findElement(webdriver.By.xpath("//a[@class='possibleReservation' and @title='Reserve "+args[3]+" starting at "+args[5]+"']"));
driver.executeScript("arguments[0].scrollIntoView(false)", selectElem);
driver.sleep(400);
selectElem.click();

handleConfirm(args[7]);

function handleConfirm(t) {
	// Type in study message and confirm
	driver.wait(webdriver.until.elementLocated(webdriver.By.id("popup-title")));
	selectElem = driver.findElement(webdriver.By.id("popup-title"));
	driver.executeScript("arguments[0].scrollIntoView(false)", selectElem);
	driver.sleep(400);
	selectElem.sendKeys("rekt");
	driver.wait(webdriver.until.elementLocated(webdriver.By.id("end-select")));
	selectElem = driver.findElement(webdriver.By.id("end-select"));
	selectElem.click();
	selectElem.sendKeys(t);
	selectElem.sendKeys(webdriver.Key.ENTER);
	driver.wait(webdriver.until.elementLocated(webdriver.By.id("reserveSubmit")));
	driver.findElement(webdriver.By.id("reserveSubmit")).click();

	// Close message and continue
	driver.wait(webdriver.until.elementLocated(webdriver.By.id("close-pop")));
	driver.findElement(webdriver.By.id("close-pop")).click();
}