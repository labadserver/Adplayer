$ADP.Message = {
	types: { 
		     nomsg:'NULL',
		     pullOBA:'ADP.Registry.pullOBA',
		     pullOBA_ACK: 'ADP.Registry.pullOBA_ACK',
		     unRegOBA: 'ADP.Registry.unRegOBA',
		     unRegOBA_ACK:'ADP.Registry.unRegOBA_ACK'
	},
	create: function(type,data) {
		var msg = {
			 type:type,
		   data:data
	       };
		try {
			return JSON.stringify(msg);
		} catch(e) {
			return '{"type":"NULL"}';
	    }
    },
	parse: function(data) {
		try {
			var msg = JSON.parse(data);
			return msg;
		} catch (e) {
			return $ADP.Message.create('NULL',{});
		}
	},
	send: function(trgt,type,data) {
		if (trgt && trgt.postMessage) {
			var msg = $ADP.Message.create(type,data);
			trgt.postMessage(msg,'*');
		}
	}
}