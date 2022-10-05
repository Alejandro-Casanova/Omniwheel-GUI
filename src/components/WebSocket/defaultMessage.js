
const defaultMessage = {
    msg_type: "", // command, subscribe, unsubscribe, get, keepAlive
    payload: {
        device_id: "",
        data_type: "", //position, velocity, status, info
        cmd_type: "",
        rw: "", 
        data: {
            time: 0,
            pos: [],
            vel: [],
            status: {
                connection: "",
                battery: 0
            },
            info: {
                name: "",
                type: "",
            }
        }
    }
}

export default defaultMessage;