import { addDays, addSeconds, addYears } from "date-fns";
import dateConverter from "../../components/main/dateConverter";
import addHours from "date-fns/addHours";
import addMinutes from "date-fns/addMinutes";

describe("date function", () => {
  it("converst something from 30 secs to now", () => {
    let currentDate = new Date();
    currentDate = addSeconds(currentDate, -30);
    expect(dateConverter(currentDate)).toBe("Now");
  });
  it("converts something today to hours", () => {
    let currentDate = new Date();
    currentDate = addHours(currentDate, -1);
    expect(dateConverter(currentDate)).toBe("1 hour ago");
  });
  it("converts something within the hour to minutes", () => {
    let currentDate = new Date();
    currentDate = addMinutes(currentDate, -30);
    expect(dateConverter(currentDate)).toBe("30 minutes ago");
  });
  it("converts something a day ago to days", () => {
    let currentDate = new Date();
    currentDate = addDays(currentDate, -1);
    expect(dateConverter(currentDate)).toBe("1 day ago");
  });
  it("converts something a year ago to 1 year", () => {
    let currentDate = new Date();
    currentDate = addYears(currentDate, -1);
    expect(dateConverter(currentDate)).toBe("1 year ago");
  });
});