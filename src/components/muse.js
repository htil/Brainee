const Muse = (() => {
  this.buffer = [];
  this.channels = {};
  this.formattedData = [];
  this.SECONDS = 6;
  this.sampleRate = 256;
  this.BUFFER_SIZE = 2000;
  this.device = null;
  this.electrodeMap = {2: "af7", 3: 'af8', 16:'tp9', 17:'tp10' }


  this.startMuse = processUpdate => {
    this.device = new window.BCIDevice({
      dataHandler: sample => {
        let { electrode, data } = sample;
        let elec = this.electrodeMap[electrode]
        processUpdate(elec, data)
      }
    });
    this.device.connect();

  };


  

  return Muse;
})();
