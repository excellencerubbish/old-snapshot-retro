// https://github.com/kulshekhar/ts-jest/issues/1068
import { beforeEach, afterEach, describe, expect, test } from "@jest/globals";
import { Blob } from "game/units";

/* ----------------------------- Test setup demo ---------------------------- */

describe("Dummy suite", function () {
  //https://jestjs.io/docs/setup-teardown
  beforeEach(() => {
    console.log("1 - beforeEach");
  });

  afterEach(() => {
    console.log("1 - afterEach");
  });

  function sum(a: number, b: number): number {
    return a + b;
  }

  test("adds 1 + 2 to equal 3", () => {
    expect(sum(1, 2)).toBe(3);
  });
});

/* ------------------------------ Unit - Blob ------------------------------ */

describe("Unit - Blob", function () {
  let blob: Blob;

  beforeEach(() => {
    blob = new Blob("1");
  });

  test("blob hp, atk = 2, id = 1", () => {
    expect(blob.getHealth()).toBe(2);
    expect(blob.getAttack()).toBe(2);
    expect(blob.getID()).toBe("1");
  });
});
