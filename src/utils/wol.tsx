import dgram from 'react-native-udp';
import {Buffer} from '@craftzdog/react-native-buffer';

var mac_bytes = 6;

const createMagicPacket = (mac: string) => {
  var mac_buffer = Buffer.alloc(mac_bytes),
    i;
  if (mac.length === 2 * mac_bytes + (mac_bytes - 1)) {
    mac = mac.replace(new RegExp(mac[2], 'g'), '');
  }
  if (mac.length !== 2 * mac_bytes || mac.match(/[^a-fA-F0-9]/)) {
    throw new Error("malformed MAC address '" + mac + "'");
  }

  for (i = 0; i < mac_bytes; ++i) {
    mac_buffer[i] = parseInt(mac.substr(2 * i, 2), 16);
  }

  var num_macs = 16,
    buffer = Buffer.alloc((1 + num_macs) * mac_bytes);
  for (i = 0; i < mac_bytes; ++i) {
    buffer[i] = 0xff;
  }
  for (i = 0; i < num_macs; ++i) {
    mac_buffer.copy(buffer, (i + 1) * mac_bytes, 0, mac_buffer.length);
  }
  return buffer;
};

export const wake = (mac: string, opts: any, callback: (err: any) => void) => {
  if (typeof opts === 'function') {
    callback = opts;
    opts = undefined;
  }

  opts = opts || {};

  var address = opts.address || '255.255.255.255',
    num_packets = opts.num_packets || 3,
    interval = opts.interval || 100,
    port = opts.port || 9,
    magic_packet = createMagicPacket(mac),
    socket: any = dgram.createSocket({type: 'udp4', debug: true}),
    i = 0,
    timer_id: any;
  console.log('Magic packet created', {address, num_packets, interval, port});

  const post_write = (error: any) => {
    if (error || i === num_packets) {
      try {
        socket.close();
      } catch (ex) {
        error = error || ex;
      }
      if (timer_id) {
        clearTimeout(timer_id);
      }
      if (callback) {
        callback(error);
      }
    }
  };

  socket.on('error', post_write);

  const sendWoL = () => {
    i += 1;
    socket.send(
      magic_packet,
      0,
      magic_packet.length,
      port,
      address,
      post_write,
    );
    if (i < num_packets) {
      timer_id = setTimeout(sendWoL, interval);
    } else {
      timer_id = undefined;
    }
  };

  socket.once('listening', () => {
    socket.setBroadcast(true);
  });
  sendWoL();
};
