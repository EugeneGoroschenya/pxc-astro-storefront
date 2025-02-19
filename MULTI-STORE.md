Create symlink to standard sources to store sources

```shell
mkdir -p ./stores/prodexa
cd ./stores/prodexa
ln -s ../../src/* .
cd ../..
```

To check broken symlinks

```shell
find -L ./stores/prodexa -type l -print
```

To remove store sources
```shell
rm -r ./stores/prodexa
```

To run or build store, switch to store sources
https://docs.astro.build/en/reference/configuration-reference/#srcdir

**PROBLEM**: https://github.com/withastro/astro/issues/8881
* https://www.eliostruyf.com/symlink-content-astro-portability/
* https://github.com/withastro/astro/issues/8262#issuecomment-1789580080
* https://github.com/vitejs/vite/issues/10802#issuecomment-2520633838
* https://github.com/vitejs/vite/issues/10802#issuecomment-2661282829


Unlink & Link example to change store sources only and keep standard sources  
```shell
rm ./stores/prodexa/pages
mkdir ./stores/prodexa/pages
cd ./stores/prodexa/pages
ln -s ../../../src/pages/* .
rm ./index.astro
cp ../../../src/pages/index.astro .
cd ../../..
# modify ./stores/prodexa/pages/index.astro
```

```shell
rm ./stores/prodexa/pages/products
mkdir ./stores/prodexa/pages/products
cd ./stores/prodexa/pages/products
ln -s ../../../../src/pages/products/* .
rm "./[product].astro"
cp "../../../../src/pages/products/[product].astro" .
cd ../../../..
# modify ./stores/prodexa/pages/index.astro
```