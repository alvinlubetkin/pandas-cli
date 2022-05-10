#! /usr/bin/env node
const yargs = require("yargs");
const { check, checkTokenId } = require("./functions");
yargs
  .command(
    ["check"],
    "check mint info",
    (yargs) => {
      yargs.positional("network", {
        describe: "name to display",
        default: "all",
      });
    },
    async (argv) => {
      await check(argv.network);
    }
  )
  .command(
    ["checkId"],
    "check whether a tokenId has been minted",
    (yargs) => {
      yargs.positional("id", {
        describe: "tokenId to be checked",
        default: 0,
      }); //.option('id', {
      //   describe: "tokenId to be checked",

      // })
    },
    async (argv) => {
      await checkTokenId(argv.id);
    }
  )
  .help("h");

yargs.parse();
