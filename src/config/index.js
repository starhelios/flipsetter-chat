import config from "./Config";
import {default as colors} from "./Colors";
import {default as layout} from "./Layout";
import {default as api} from "./Api";

export default {
 ...config, colors: {...colors}, layout: {...layout}, api: {...api()},
}