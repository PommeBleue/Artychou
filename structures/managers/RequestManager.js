const Enmap = require("enmap");
const { Collection } = require("discord.js");
const RequestState = require("../models/requests/RequestState");
const RequestArray = require("../models/requests/RequestArray");
const Request = require("../models/requests/Request");
const util = require("../../utils/types/TypeUtil");

class RequestManager {
    constructor(client) {
        this.client = client;
        this.requests = this.settings = new Enmap({name: "request-state", cloneLevel: "deep", fetchAll: false, autoFetch: true});
    }

    getRequestState(id, type = "NONE") {
        const types = util.REQUESTSATES;
        const states = this.getRequestStates(id);
        if(type === "NONE") return states;
        if(!types.includes(type)) throw new Error(`type is not valid. Valid Types : ${types}`);
        for(let j in states) if(states[j][0] === type) return states[j][1];
        throw new Error();
    }

    getRequestStates(id) {
        if(!this.requests.get(id)) return this.createNewRequestStates(id);
        return this.requests.get(id);
    }

    setRequestStates(id, states) {
        this.requests.set(id, states);
        return this.requests.get(id);
    }

    setRequestState(id, state, type) {
        if(!type) throw new Error('type is not defined');
        const array = this.getRequestStates(id).map(element => {
            if(element[0] === type) {
                return [type, state];
            } else return element;
        });
        return this.setRequestStates(id, array);
    }

    createNewRequestStates(id) {
        const types = util.REQUESTSATES;
        const states = [];
        for(let i in types) {
            const type = types[i];
            const state = new RequestState(type);
            states.push([type, state]);
        }
        return this.setRequestStates(id, states);
    }

    getArray(state, object = false) {
        const { requests } = state;
        if(object) {
            const array = new RequestArray(requests["requests"]);
            state.requests = array;
            return array;
        }
        return requests["requests"];
    }

    createNewRequest({requesting, target}, type) {
        const types = util.REQUESTS;
        if(!types.includes(type)) throw new Error(`type is not valid. Valid Types are : ${types}`);
        const request = new Request(type);
        request.configure({requesting, target});
        const reqState = this.getRequestState(requesting, 'REQUESTING');
        if(this.getArray(reqState).some(e => Object.values(e).every(x => Object.values({...request}).includes(x)))) return 'request already running';
        this.getArray(reqState).push(request);
        this.setRequestState(requesting, reqState, 'REQUESTING');
        const tarState = this.getRequestState(target, 'TARGET');
        if(this.getArray(tarState).some(e => Object.values(e).every(x => Object.values({...request}).includes(x)))) return 'request already running';
        this.getArray(tarState).push(request);
        this.setRequestState(target, tarState, 'TARGET');
        return request;
    }
}

module.exports = RequestManager;