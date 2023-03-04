const assert = require("assert");
const { Given, When, Then } = require("@cucumber/cucumber");
const webdriver = require("selenium-webdriver");

function isItFriday(today) {
  if (today === "Friday") {
    return "TGIF";
  } else {
    return "Nope";
  }
}

When("we Google webdriver", async function () {
  const world = this;

  let driver = new webdriver.Builder().forBrowser("chrome").build();
  try {
    await driver.get(world.serverUrl);
    let title = await driver.getTitle();
    assert.strictEqual(title, "Phoenix");
  } finally {
    await driver.quit();
  }
});

Given("today is {string}", function (givenDay) {
  this.today = givenDay;
});

When("I ask whether it's Friday yet", function () {
  this.actualAnswer = isItFriday(this.today);
});

Then("I should be told {string}", function (expectedAnswer) {
  assert.strictEqual(this.actualAnswer, expectedAnswer);
});
