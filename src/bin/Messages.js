/**
 * Created by tushar.mathur on 02/07/16.
 */

'use strict'

import Humanize from 'humanize-plus'
export const Help = `		
 Usage		
 	  mtd		
 		
 	Options		
 	  --url            The url of the file that needs to be downloaded		
 	  --file           Path to the .mtd file for resuming failed downloads		
 		
 	Examples		
 	  mtd --url http://www.sample-videos.com/video/mp4/720/big_buck_bunny_720p_1mb.mp4		
 	  mtd --file big_buck_bunny_720p_1mb.mp4.mtd		
   `
export const Status = (size) => (`
SIZE: ${Humanize.filesize(size)}
`)
