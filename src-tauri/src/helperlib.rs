pub fn plus(a: i32, b: i32) -> i32 {
    a + b
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    pub fn regarding_plus() {
        assert_eq!(plus(1, 2), 3);

        // Note we could "panic!()" to create a simple failed test.
        // The panic will not cause the testrunner to panic.
    }

    #[test]
    pub fn add_too_negative() -> Result<(), String> {
        if plus(-1, -2) < 0 {
            Ok(())
        } else {
            Err(String::from("Result must be negative"))
        }
    }
}
