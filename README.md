# Muchachow 
Muchachow is a under development POC Chorme extension for collection and managment of web data  
built for easy micro-scraping.   
## Installation
* Download [muchachow.crx](muchachow.crx)
* Open your chrome browser.
* Access "Extensions":
  * chrome://extensions/ ,or
  * Chrome menu -> More tools -> Extensions.
* Drag and drop muchachow.crx to "Extensions" tab.
* click "Add extension".
* Done! Read next part for usage.
## Usage
*if your are not on github, open [Muchachow's README on Github](https://github.com/turbowizard/Muchachow/blob/master/README.md) with Chrome.  
*make sure you have the extension ![](m1616.png) . if not, read previous part.    
* Click on the Muchachow extension (extension toolbar).  
* Type Muchachow in the input field and click new to create new group.  
* The Muchachow group is marked light-green and it is now Active! (all captured are added to it).  
* The green box left to the group name is the "group status", new groups will decay over time. 
* Right click on the icon 3 lines above and click on Muchachow's options.  
* This Element can be captured as image or a link, click on "IMAGE -> Muchachow".  
* Click on the Muchachow extension to see what have you captured.  
* Go haed and add the link on the first line of this part, previous step to see change.  
* You can now click the Exp button to expand group in new tab.
* You can find an example to import in the example groups folder, just copy json to import input.
* Done! Read next part for notes.  
## Notes
* Project is under development.
* State is not saved on Chrome exit.
* You can:
  * Groups:  
    * Create new groups(extension) - name input, click new.
	* Import a group(extension) - json group input, click import.
	* Restore extension to default(extension) - click Drop.
    * Delete group(extension) - click del on group menu.
    * Expand group(extension) - click exp on group menu, expand in new tab.
    * Group navigation(extension) - click on group name to switch active.
	* Get group JSON(expand) - exp group to get json.
  * Items:
    * Items shown under "items"(extension) are from active group.
    * Item interact(extension) - click link to open, hover token to see text.
* Done! Read next for contributing 
## Contributing
* Suggest improvments, concept utilizations.
* Share your groups.
* Make some changes:
  * Fork it (https://github.com/turbowizard/Muchachow/fork)
  * Create your feature branch (`git checkout -b feature/fooBar`)
  * __Test your extension changes with Chrome__.
  * Commit your changes (`git commit -am 'Add some fooBar'`)
  * Push to the branch (`git push origin feature/fooBar`)
  * Create a new Pull Request. 

*__Test your extension changes with Chrome__ (how to load unpacked extension):  
* Access "Extensions":
  * chrome://extensions/ ,or
  * Chrome menu -> More tools -> Extensions.
* Tick "Developer mode" to enable it.
* Click "Load unpacked extension".
* Navigate to project's folder.
* Click ok.
## Change Log
* Item handling changed to generic, import issue fixed.
* Group decay system added.
  * Color left of group name indicates group's status.
  * Color will change over time:
	* Full decay after 5 days, group will be deleted.
    * Green - 0% ,yellow - 40% ,red - 70% (of decay time).
	* Imported groups will set to time on import.