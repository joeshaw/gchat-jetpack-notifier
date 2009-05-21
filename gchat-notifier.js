// Gmail chat notifier for Jetpack
// http://joeshaw.org/dropbox/gchat-notifier.html
// http://github.com/joeshaw/gchat-jetpack-notifier
// Version 0.0 - 20 May 2009
//
// Copyright (c) 2009 Joe Shaw
// Licensed under MIT X11 license

function attach_notifier(doc) {
	var gmailUrlRegex = /http(s?):\/\/mail.google.com\/(mail|a\/.*)\/(\?.*)?#/;
 
	// Ok, see if we're loading a Gmail page. Exit if not.
	if (doc.location.href.search(gmailUrlRegex) == -1)
		return;
  
	// Keep track of the people we heard from recently, so that we don't repeat
	// notifications.
	old_unread_chats = {}
  
	setInterval(function() {
			unread_chats = {}

			// This is almost certainly very, very fragile, as the classes seem to change
			// often in Gmail, but the chat data is not exposed through their greasemonkey
			// interface.
			//
			// Right now, chats boxes are divs with classes nH and lo.  Unread chats
			// additionally have the lp class.  To find the name of the person chatting,
			// look for the div with the kQ class underneath the chat box.
			$("div.nH.lo.lp div.kQ", doc).each(function() {
					name = $(this).text();
					unread_chats[name] = 1;
				});
      
			for (var name in unread_chats) {
				if (!(name in old_unread_chats)) {
					jetpack.notifications.show({
						title: "New Gmail chat",
								body: "New chat messages from " + name,
								icon: "data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAABMLAAATCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwAAABYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFxMRnxZSkS5AAAAFgAAAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAemtkuz4yLLs4KyeMAAAAFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFltLRf+3p6D/ZVZR/ywhHrsAAAAfAAAAFgAAAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAAAAHzQpJbt9bWf/6dnS/+nZ0v9xYVz/Nysn/zQpJbsxJiOMAAAAHwAAAA8AAAAAAAAAAAAAAAAAAAAWPzMujEc5NP+Cc2z/6dnS/+nZ0v/p2dL/6dnS/+bWz/+mlY//eWhj/0c5NP8/My6MAAAAFgAAAAAAAAAHVEZAu5GBev/ZycL/6dnS/+nZ0v/p2dL/6dnS/+nZ0v/p2dL/5dXO/9XEvf/Csar/hnZw/1RFQLsAAAAPSj46VYZ3cf/r3Nb/69zW/+vc1v/r3Nb/69zW/+vc1v/r3Nb/69zW/+vc1v/fz8n/0L+5/9C/uf+RgHr/WkxHjG1dV//BtK7/7+Pd/+/k3//w5eD/8Obh//Hm4v/x5uL/8ebi//Dm4f/w5eD/6d3Y/9HBu//Rwbr/xrav/2xcVv9zZF//9Ozo//bw7f/48/H/+vb0//v49v/8+fj//Pr5//z5+P/7+Pb/+vb0//fy8P/Txb//0sS+/9LDvf9yY13/e25o/9zX1f/9/Pz//v39//7+/v///v7///////////////////7+//7+/v/28/L/1cnE/9XIw//Ty8f/eWpl/4N3cleupqP/////////////////////////////////////////////////7Ofl/9bKxf/18fD/qJ6b/4BzblcAAAAAjIF8sru1sv//////////////////////////////////////+Pb2//f19P/18vH/tq2q/4l9eLIAAAAAAAAAAAAAAACUiYWylImF/8C6uP/08/P//////////////////v79/+7s6v+6sq//kIWA/5CFgLIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACcko98nJKP/5ySj/+cko//m5GN/5mPi/+YjYn/mI2JfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAPv/AAD4/wAA+H8AAPAPAADAAwAAgAEAAIAAAAAAAAAAAAAAAAAAAACAAQAAgAEAAMADAAD4HwAA//8AAA=="
								});
				}
			}
			old_unread_chats = unread_chats;
		}, 1000);
}

// Attach to all future tabs
jetpack.tabs.onReady(attach_notifier);

// Attach to all current tabs
for (var i = 0; i < jetpack.tabs.length; i++) {
	attach_notifier(jetpack.tabs[i].contentWindow.document);
}