const chai = require("chai");
const path = require("path");
const F3g = require("../src/f3g");
const {polMulAxi} = require("../src/polutils");

const assert = chai.assert;

const wasm_tester = require("circom_tester").wasm;

describe("GL in BN128 circuit", function () {
    let eddsa;
    let F;
    let circuitMul;
    let circuitCMul;
    let circuitMulAdd;
    let circuitCMulAdd;
    let circuitInv;
    let circuitCInv;

    this.timeout(10000000);

    before( async() => {
        circuitMul = await wasm_tester(path.join(__dirname, "circuits", "glmul.bn128.test.circom"), {O:1});
        circuitCMul = await wasm_tester(path.join(__dirname, "circuits", "glcmul.bn128.test.circom"), {O:1});
        circuitMulAdd = await wasm_tester(path.join(__dirname, "circuits", "glmuladd.bn128.test.circom"), {O:1});
        circuitCMulAdd = await wasm_tester(path.join(__dirname, "circuits", "glcmuladd.bn128.test.circom"), {O:1});
        circuitInv = await wasm_tester(path.join(__dirname, "circuits", "glinv.bn128.test.circom"), {O:1});
        circuitCInv = await wasm_tester(path.join(__dirname, "circuits", "glcinv.bn128.test.circom"), {O:1});
    });

    it("Should check a basefield multiplication", async () => {
        const F = new F3g();

        const input={
            ina: F.e(-2),
            inb: F.e(-1)
        };

        const w = await circuitMul.calculateWitness(input, true);

        await circuitMul.assertOut(w, {out: 2n});

    });
    it("Should check a complex multiplication", async () => {
        const F = new F3g();

        const input={
            ina: F.e([-2, 3, -35]),
            inb: F.e([-1,-33, 4])
        };

        const w = await circuitCMul.calculateWitness(input, true);

        await circuitCMul.assertOut(w, {out: F.mul(input.ina, input.inb)});
    });

    it("Should check a basefield multiplication addition", async () => {
        const F = new F3g();

        const input={
            ina: F.e(-2),
            inb: F.e(-1),
            inc: F.e(444)
        };

        const w = await circuitMulAdd.calculateWitness(input, true);

        await circuitMulAdd.assertOut(w, {out: 446n});

    });
    it("Should check a complex multiplication addition", async () => {
        const F = new F3g();

        const input={
            ina: F.e([-2, 3, -35]),
            inb: F.e([-1,-33, 4]),
            inc: F.e([5,-8, -99])
        };

        const w = await circuitCMulAdd.calculateWitness(input, true);

        await circuitCMulAdd.assertOut(w, {out: F.add(F.mul(input.ina, input.inb), input.inc)});
    });

    it("Should check a basefield inv", async () => {
        const F = new F3g();

        const input={
            in: F.e(2),
        };

        const w = await circuitInv.calculateWitness(input, true);

        await circuitInv.assertOut(w, {out: F.inv(input.in)});

    });
    it("Should check a complex inv", async () => {
        const F = new F3g();

        const input={
            in: F.e([-2, 3, -35]),
        };

        const w = await circuitCInv.calculateWitness(input, true);

        await circuitCInv.assertOut(w, {out:  F.inv(input.in)});

    });

});
