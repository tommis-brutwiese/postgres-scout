use std::env::args;

/// Note: proper way to do this: crate "clap"
///
/// but this is for my amusement and fun, so I choose to do it manually.

const ARG_AUTOCLOSE_AFTER_INIT: &str = "--autoclose-after-init";
const ARG_RUN_GUI: &str = "--gui";

use std::collections::HashMap;

/// Converts the current applications command line argument into a hash map.
/// Every argument is split into the part before a "=" and the part
/// after. The "=" and part after are optional.
///
/// Example:
///   Argument      Key       Value
///   --say=hello   --say     Some("Hello")
///   --sleep       --sleep   None
///
fn args_to_hashmap() -> HashMap<String, Option<String>> {
    let mut map = HashMap::<String, Option<String>>::new();
    for argument in args() {
        let items = std::vec::Vec::from_iter(argument.split("="));
        match items.len() {
            2 => map.insert(String::from(items[0]), Some(String::from(items[1]))),
            1 => map.insert(String::from(items[0]), None),
            _ => None,
        };
    }
    map
}

/// Checks if a program argument is given, and if, whether it is set to true or false
///
/// * Arguments without value are seen as "true"
/// * Arguments with a value of "1" or "0" are evalauted appropriately
///
/// Examples:
///
/// Arguments         Result
/// --sleep           get_arg_bool("--sleep") == true
/// --sleep=1         get_arg_bool("--sleep") == true
/// --sleep=0         get_arg_bool("--sleep") == false
/// --tidy --sleep    get_arg_bool("--sleep") == true
/// --tidy            get_arg_bool("--sleep") == false
///
fn get_arg_bool(arg_in_question: &str, default_value: bool) -> bool {
    let arg_map = args_to_hashmap();
    match arg_map.get(arg_in_question) {
        None => default_value, // key not existing
        Some(opt_value) => {
            // key exists, but does it have a value?
            match opt_value {
                None => true, // no value means "switch on by existence"
                Some(zero_or_one) => match zero_or_one.as_str() {
                    "1" => true,
                    "0" => false,
                    _ => false, // could be "None"
                },
            }
        }
    }
}

pub fn get_run_gui() -> bool {
    get_arg_bool(ARG_RUN_GUI, true)
}

pub fn log(source: &str, message: &str) {
    println!("{source}: {message}");
}

pub mod commands {
    use super::ARG_AUTOCLOSE_AFTER_INIT;

    #[tauri::command]
    pub async fn get_autoclose_after_init() -> bool {
        let autoclose = super::get_arg_bool(ARG_AUTOCLOSE_AFTER_INIT, false);
        super::log(
            String::from("command-line-options").as_str(),
            format!("{}: {}", ARG_AUTOCLOSE_AFTER_INIT, autoclose).as_str(),
        );
        autoclose
    }
}
