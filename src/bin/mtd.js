#!/usr/bin/env node
/**
 * Created by tushar.mathur on 04/06/16.
 */

'use strict'
import * as U from '../Utils'
import meow from 'meow'
import R from 'ramda'
const HELP_TEXT = `		
 Usage		
 	  mtd		
 		
 	Options		
 	  --url            The url of the file that needs to be downloaded		
 	  --file           Path to the .mtd file for resuming failed downloads		
 		
 	Examples		
 	  mtd --url http://www.sample-videos.com/video/mp4/720/big_buck_bunny_720p_1mb.mp4		
 	  mtd --file big_buck_bunny_720p_1mb.mp4.mtd		
   `
const flags = meow(HELP_TEXT).flags

if (!R.any(R.identity)([flags.url, flags.file])) {
  console.log(HELP_TEXT)
  process.exit(0)
}

U.CLI(flags)
