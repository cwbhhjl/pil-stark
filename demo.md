
```bash

npm install

mkdir tmp

# buildconstants
npm run fibonacci_buidconst

# exec
npm run fibonacci_exec

# genstarkinfo
node src/main_genstarkinfo.js -p test/sm_fibonacci/fibonacci_main.pil -s ./test/sm_fibonacci/fibonacci.starkstruct.json -i tmp/info.json

# buildchelpers
node src/main_buildchelpers.js -m -p test/sm_fibonacci/fibonacci_main.pil -s tmp/info.json -c tmp/chelpers/chelpers.cpp -C Steps

# buildconsttree
npm run fibonacci_buildconsttree

# prove
node src/main_prover.js -m tmp/fibonacci.commit.bin  -c tmp/fibonacci.const.bin -t tmp/fibonacci.consttree.bin -p test/sm_fibonacci/fibonacci_main.pil -s ./tmp/info.json -o tmp/proof.json -z tmp/zkin.proof.json -b tmp/public.json

# verify
node src/main_verifier.js -p test/sm_fibonacci/fibonacci_main.pil -s ./tmp/info.json -o tmp/proof.json -b tmp/public.json -v tmp/fibonacci.verkey.json

# gen circom
node src/main_pil2circom.js -p test/sm_fibonacci/fibonacci_main.pil -s ./tmp/info.json -v tmp/fibonacci.verkey.json -o tmp/fibonacci.circom

# compile circom
circom --O1 --prime goldilocks --r1cs --sym --wasm --c --verbose tmp/fibonacci.circom -o tmp -l circuits.gl

# witness
node tmp/fibonacci_js/generate_witness.js tmp/fibonacci_js/fibonacci.wasm tmp/zkin.proof.json tmp/witness.wtns

```

pil -> c12a -> recursive1 -> recursive2 -> final

不能完全运行

```bash
# c12a setup
node src/compressor12/main_compressor12_setup.js  -r tmp/fibonacci.r1cs  -p tmp/c12a.pil -c tmp/c12a.const -e tmp/c12a.exec

# c12a_buildstarkinfo
node src/main_genstarkinfo.js -p tmp/c12a.pil -s ./test/sm_fibonacci/fibonacci.c12.starkstruct.json -i tmp/c12a.starkinfo.json

# c12a exec
node src/compressor12/main_compressor12_exec.js -i tmp/zkin.proof.json -w tmp/fibonacci_js/fibonacci.wasm -p tmp/c12a.pil -e tmp/c12a.exec -m tmp/c12a.commit

# c12a buildconstanttree
node src/main_buildconsttree.js -c tmp/c12a.const -p tmp/c12a.pil -s ./test/sm_fibonacci/fibonacci.c12.starkstruct.json -t tmp/c12a.consttree -v tmp/c12a.verkey.json

# c12a gen circom
node src/main_pil2circom.js --skipMain -p tmp/c12a.pil -s tmp/c12a.starkinfo.json -v tmp/c12a.verkey.json -o tmp/c12a.verifier.circom

cp recursive/recursive1.circom tmp/recursive1.circom

# recursive1
circom --r1cs --sym --wasm --c --verbose --O1 --prime goldilocks tmp/recursive1.circom -o tmp -l circuits.gl -l circuits.bn128  -l node_modules/circomlib/circuits
```

