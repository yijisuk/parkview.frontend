import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import { PARKVIEW_SUPABASE_URL, PARKVIEW_ANNON_KEY } from "@env";

const supabaseUrl = PARKVIEW_SUPABASE_URL;
const supabaseKey = PARKVIEW_ANNON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
