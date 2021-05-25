const request = require("supertest");
const app = require("../app");
const fs = require("fs");
const data = JSON.parse(fs.readFileSync("events.json"));

describe("GET /", () => {
  it("responds with json", done => {
    request(app)
      .get("/events")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });

  it("responds with list of events", done => {
    request(app)
      .get("/events")
      .expect(200, data, done);
  });
});

describe("GET /events", () => {
  it("responds with json", done => {
    request(app)
      .get("/events")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });

  it("responds with list of events", done => {
    request(app)
      .get("/events")
      .expect(200, data, done);
  });
});

describe("POST /events", () => {
  it("adds new event on available date", done => {
    const newEvent = {
      name: "New meetup",
      date: "2012-06-16"
    };
    request(app)
      .post("/events")
      .set("Accept", "application/json")
      .send({ event: newEvent })
      .expect(201)
      .then(() => {
        request(app)
          .get("/events")
          .expect(200, { events: data.events.concat(newEvent) }, done);
      });
  });
  it("does not add on date already taken", done => {
    request(app)
      .post("/events")
      .set("Accept", "application/json")
      .send({
        event: {
          name: "New meetup",
          date: data.events[0].date
        }
      })
      .expect(400, done);
  });
});

describe("DELETE /event/:date", () => {
  it("deletes event from given date", done => {
    request(app)
      .get("/events")
      .then(response => {
        const events = response.body.events;
        request(app)
          .delete("/event/" + events[0].date)
          .expect(200, { events: events.slice(1, events.length) }, done);
      }, done);
  });
});
