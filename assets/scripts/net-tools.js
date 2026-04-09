
IP_GENERIC = "0.0.0.0"
MAC_GENERIC = "00:00:00:00:00:00"
DYNAMIC_MAC = "DYNAMIC"
STATIC_MAC = "STATIC"

/**
 * 
 */


class Host {
    constructor(ip=IP_GENERIC, mac=MAC_GENERIC) {
        this.__ip = ip;
        this.__mac = mac;
    }

    sendBroadcastFrame() {
        
    }

    arp() {
        /**
         * 
         */
    }
}


class MacEntry {
    constructor(vlan=[], mac=MAC_GENERIC, type=STATIC_MAC, ports=[]) {
        this.__entry = {
            "vlan": vlan,
            "mac": mac,
            "type": type,
            "ports": ports
        };
    }

    get entry() {
        return this.__entry;
    }

    toString() {

    }
}


class Switch extends Host {
    /**
     * switches use and maintain a mac address table
     * switches perform three actions:
     * - learn: update mac address table with mapping of switch port to source mac
     * - flood: duplicate and send frame out all switch ports (except receiving port)
     *          used when the destination mac address is unknown
     * - forward: use mac address table to deliver frame to appropriate switch port
     * 
     * after the mac address table is populated with the macs of both hosts trying to communicate with each other, the hosts can just directly send data to each other without the switch needing to perform the flooding action
     * 
     * switches are also considered a host, and devices can not only send data through the switch, but to the switch itself
     * when sending information through the switch, its own ip and mac are not relevant
     */
    static MAX_PORTS = 48;
    constructor() {
        super();
        this.__ports = [];
        this.__macTable = [];

        for (let i = 0; i < Switch.MAX_PORTS; i++) {
            this.__ports.push(null);
        }
    }

    createVlanString(vlan=[]) {
        let vlanString = '[';

        for (let i = 0; i < vlan.length; i++) {
            vlanString += vlan[i];

            if (i + 1 < vlan.length) {
                vlanString += ', ';
            }
        }
        vlanString += ']';

        return vlanString;
    }

    createPortsString(ports=[]) {
        let portsString = '[';

        for (let i = 0; i < ports.length; i++) {
            portsString += `"${ports[i]}"`;

            if (i + 1 < ports.length) {
                portsString += ', ';
            }
        }
        portsString += ']';

        return portsString;
    }

    createMacEntry(vlan=[], mac=MAC_GENERIC, type=STATIC_MAC, ports=[]) {
        let vlanString = this.createVlanString(vlan);
        let portsString = this.createPortsString(ports);

        const entryString = `{"vlan": ${vlanString}, "mac": "${mac}", "type": "${type}", "ports": ${portsString}}`;
        const entry = JSON.parse(entryString);
        this.__macTable.push(entry);
    }

    printMacTable() {
        for (let i = 0; i < this.__macTable.length; i++) {
            console.log(this.__macTable[i].mac);
        }
    }
}

let sw0 = new Switch();
sw0.createMacEntry([1, 2, 3, 4], "AA:BB:CC:DD:EE:FF", STATIC_MAC, ["Fa0/1"]);
sw0.printMacTable();

class Router {
    constructor() {
        this.__routingTable = [];
    }
}

function decToBin(value=0) {
    let bin = "";
    let dec = value;

    while (Math.floor(dec) != 0) {
        if (dec % 2 == 0) {
            bin = "0" + bin;
        }
        else {
            bin = "1" + bin;
        }
        dec = Math.floor(dec / 2);
    }

    return bin;
}

class IPv4 {
    static INPUTS = [
        "ip-1",
        "ip-2",
        "ip-3",
        "ip-4"
    ];

    static OCTETS = [
        "ip-octet-1",
        "ip-octet-2",
        "ip-octet-3",
        "ip-octet-4"
    ];

    static MIN_DEC = 0;
    static MAX_DEC = 255;
    static MIN_BYTE = "00000000";
    static MAX_BYTE = "11111111";

    constructor() {
        this.__inputs = [];
        this.__octets = [];

        for (let i = 0; i < IPv4.INPUTS.length; i++) {
            this.__inputs.push(document.getElementById(IPv4.INPUTS[i]));
        }

        for (let i = 0; i < IPv4.OCTETS.length; i++) {
            this.__octets.push(document.getElementById(IPv4.OCTETS[i]));
        }

        for (let i = 0; i < this.__inputs.length; i++) {
            let element = this.__inputs[i];
            let octetElement = this.__octets[i];

            element.value = IPv4.MIN_DEC;

            element.addEventListener("change", (e) => {
                let val = e.target.value;

                if (isNaN(parseInt(val))) {
                    e.target.value = IPv4.MIN_DEC;
                }
                else if (val < IPv4.MIN_DEC) {
                    e.target.value = IPv4.MIN_DEC;
                }
                else if (val > IPv4.MAX_DEC) {
                    e.target.value = IPv4.MIN_DEC;
                }
                else {
                    octetElement.innerText = decToBin(val);
                }
            });
        }

        for (let i = 0; i < this.__octets.length; i++) {
            let element = this.__octets[i];

            element.value = IPv4.MIN_BYTE;
        }
    }
}

let ipv4 = new IPv4();
