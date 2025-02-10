use rocket::{get, routes, launch, build};

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

#[get("/upload")]
fn upload() -> &'static str {
    "Hello, uploader!"
}

#[launch]
fn rocket() -> _ {
    build().mount("/", routes![index, upload])
}