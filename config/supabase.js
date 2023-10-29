import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import {
    PARKVIEW_SUPABASE_URL,
    PARKVIEW_ANNON_KEY,
    PARKVIEW_SERVICE_ROLE_KEY,
} from "@env";

const supabaseUrl = PARKVIEW_SUPABASE_URL;
const supabaseKey = PARKVIEW_ANNON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
    }
});

export default supabase;
