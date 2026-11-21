
console.log("BlogSpace application started successfully!");


// =====================================
// READ MORE FUNCTION
// =====================================


function readBlog(title) {

    const blogs = JSON.parse(localStorage.getItem("blogs")) || [];

    const selectedBlog = blogs.find(function(blog) {
        return blog.title === title;
    });

    if (selectedBlog) {
        localStorage.setItem("currentReadingBlog", JSON.stringify(selectedBlog));
    } else {
        localStorage.removeItem("currentReadingBlog");
        localStorage.setItem("currentReadingTitle", title);
    }

    window.location.href = "read-blog.html";
}


// =====================================
// SEARCH BLOGS FUNCTION
// =====================================

function searchBlogs() {

    const searchInput = document.getElementById("searchInput");

    if (!searchInput) return;

    const searchText = searchInput.value.toLowerCase().trim();

    const blogCards = document.querySelectorAll(".blog-card");

    let found = 0;

    blogCards.forEach(function(card) {

        const title = (card.dataset.title || "").toLowerCase();
        const category = (card.dataset.category || "").toLowerCase();
        const description = card.innerText.toLowerCase();

        if (
            title.includes(searchText) ||
            category.includes(searchText) ||
            description.includes(searchText)
        ) {

            card.style.display = "block";
            found++;

        } else {

            card.style.display = "none";

        }

    });

    const noResults = document.getElementById("noResults");

    if (noResults) {
        noResults.hidden = found !== 0;
    }
}


// =====================================
// CATEGORY FILTER FUNCTION
// =====================================

function filterBlogs(category, button) {

    const blogCards = document.querySelectorAll(".blog-card");

    let found = 0;

    blogCards.forEach(function(card) {

        if (
            category === "all" ||
            card.dataset.category === category
        ) {

            card.style.display = "block";
            found++;

        } else {

            card.style.display = "none";

        }

    });

    const buttons = document.querySelectorAll(".category-btn");

    buttons.forEach(function(btn) {
        btn.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    }

    const noResults = document.getElementById("noResults");

    if (noResults) {
        noResults.hidden = found !== 0;
    }

    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
        searchInput.value = "";
    }
}


// =====================================
// SEARCH WHEN ENTER KEY IS PRESSED
// =====================================

const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("keydown", function(event) {

        if (event.key === "Enter") {
            event.preventDefault();
            searchBlogs();
        }

    });

}


// =====================================
// REGISTER PAGE FUNCTIONALITY
// =====================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (password.length < 8) {
            alert("Password must contain at least 8 characters!");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        const existingUser = users.find(function(user) {
            return user.email === email;
        });

        if (existingUser) {
            alert("Email is already registered!");
            return;
        }

        users.push({
            name: name,
            email: email,
            password: password
        });

        localStorage.setItem("users", JSON.stringify(users));

        alert("Registration successful! Please login.");

        window.location.href = "login.html";

    });

}


// =====================================
// LOGIN PAGE FUNCTIONALITY
// =====================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;

        const users = JSON.parse(localStorage.getItem("users")) || [];

        const user = users.find(function(user) {

            return user.email === email &&
                   user.password === password;

        });

        if (user) {

            localStorage.setItem("loggedInUser", JSON.stringify({
                name: user.name,
                email: user.email
            }));

            alert("Login successful!");

            window.location.href = "dashboard.html";

        } else {

            alert("Invalid email or password!");

        }

    });

}


// =====================================
// DASHBOARD FUNCTIONALITY
// =====================================

const welcomeMessage = document.getElementById("welcomeMessage");

if (welcomeMessage) {

    const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
    );

    if (!loggedInUser) {

        window.location.href = "login.html";

    } else {

        welcomeMessage.textContent =
            "Hello, " + loggedInUser.name + "! Welcome to BlogSpace.";

        document.getElementById("profileName").textContent =
            loggedInUser.name;

    }

}


// =====================================
// LOGOUT FUNCTIONALITY
// =====================================

const logoutLink = document.getElementById("logoutLink");

if (logoutLink) {

    logoutLink.addEventListener("click", function(event) {

        event.preventDefault();

        localStorage.removeItem("loggedInUser");

        alert("You have logged out successfully!");

        window.location.href = "login.html";

    });

}



// =====================================
// CREATE BLOG FUNCTIONALITY
// =====================================

const createBlogForm = document.getElementById("createBlogForm");

if (createBlogForm) {

    createBlogForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const title = document.getElementById("blogTitle").value.trim();

        const category = document.getElementById("blogCategory").value;

        const description = document.getElementById("blogDescription").value.trim();

        const imageInput = document.getElementById("blogImage");

        const loggedInUser = JSON.parse(
            localStorage.getItem("loggedInUser")
        );

        if (!loggedInUser) {
            alert("Please login before publishing a blog!");
            window.location.href = "login.html";
            return;
        }

        if (!title || !category || !description) {
            alert("Please fill all required fields!");
            return;
        }

        function saveBlog(imageData) {

            let blogs = JSON.parse(localStorage.getItem("blogs")) || [];

            const newBlog = {
                id: Date.now(),
                title: title,
                category: category,
                description: description,
                image: imageData,
                author: loggedInUser.name,
                date: new Date().toLocaleDateString()
            };

            blogs.push(newBlog);

            localStorage.setItem("blogs", JSON.stringify(blogs));

            alert("Blog published successfully!");

            createBlogForm.reset();

            window.location.href = "index.html";
        }

        if (imageInput.files.length > 0) {

            const file = imageInput.files[0];

            if (!file.type.startsWith("image/")) {
                alert("Please select a valid image!");
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                alert("Image size must be less than 2 MB!");
                return;
            }

            const reader = new FileReader();

            reader.onload = function(event) {
                saveBlog(event.target.result);
            };

            reader.onerror = function() {
                alert("Unable to read image. Please try again.");
            };

            reader.readAsDataURL(file);

        } else {

            saveBlog("");

        }

    });

}



// Display blogs published by users on the Home Page
function displayPublishedBlogs() {
    const blogContainer = document.getElementById("blogContainer");

    if (!blogContainer) {
        return;
    }

    let publishedBlogs = [];

    try {
        publishedBlogs = JSON.parse(localStorage.getItem("blogs")) || [];
    } catch (error) {
        console.error("Unable to load published blogs:", error);
        return;
    }

    publishedBlogs.forEach(function(blog) {

        const article = document.createElement("article");
        article.className = "blog-card";

        article.dataset.category = blog.category || "";
        article.dataset.title = blog.title || "";

        // Blog image section
        const imageBox = document.createElement("div");
        imageBox.className = "blog-image";

        if (blog.image) {
            const image = document.createElement("img");
            image.src = blog.image;
            image.alt = blog.title || "Blog image";
            image.style.width = "100%";
            image.style.height = "100%";
            image.style.objectFit = "cover";

            imageBox.appendChild(image);
        }

        const categoryLabel = document.createElement("span");
        categoryLabel.textContent = (blog.category || "BLOG").toUpperCase();
        imageBox.appendChild(categoryLabel);

        // Blog content section
        const content = document.createElement("div");
        content.className = "blog-content";

        const heading = document.createElement("h3");
        heading.textContent = blog.title || "Untitled Blog";

        const description = document.createElement("p");
        description.textContent = blog.description || "";

        const author = document.createElement("p");
        author.textContent = "By " + (blog.author || "Unknown");

        const date = document.createElement("p");
        date.textContent = blog.date || "";

        const readButton = document.createElement("button");
        readButton.textContent = "Read More →";

        readButton.addEventListener("click", function() {
            readBlog(blog.title);
        });

        content.appendChild(heading);
        content.appendChild(description);
        content.appendChild(author);
        content.appendChild(date);
        content.appendChild(readButton);

        article.appendChild(imageBox);
        article.appendChild(content);

        blogContainer.appendChild(article);
    });
}

// Run when the Home Page loads
displayPublishedBlogs();


// Display only the logged-in user's blogs
const myBlogsContainer = document.getElementById("myBlogsContainer");

if (myBlogsContainer) {

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser) {
        window.location.href = "login.html";
    } else {

        const allBlogs = JSON.parse(localStorage.getItem("blogs")) || [];

        const userBlogs = allBlogs.filter(function(blog) {
            return blog.author === loggedInUser.name;
        });

        const message = document.getElementById("myBlogsMessage");

        if (userBlogs.length === 0) {
            message.hidden = false;
        } else {

            message.hidden = true;

            userBlogs.forEach(function(blog) {

                const card = document.createElement("div");
                card.className = "blog-card";

                const content = document.createElement("div");
                content.className = "blog-content";

                const title = document.createElement("h3");
                title.textContent = blog.title;

                const category = document.createElement("p");
                category.textContent = "Category: " + blog.category;

                const description = document.createElement("p");
                description.textContent = blog.description;

                const date = document.createElement("p");
                date.textContent = "Published: " + blog.date;

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete Blog";

                deleteButton.addEventListener("click", function() {

                    const confirmDelete = confirm("Are you sure you want to delete this blog?");

                    if (confirmDelete) {

                        const updatedBlogs = allBlogs.filter(function(item) {
                            return item.id !== blog.id;
                        });

                        localStorage.setItem("blogs", JSON.stringify(updatedBlogs));

                        alert("Blog deleted successfully!");

                        location.reload();
                    }
                });

                content.appendChild(title);
                content.appendChild(category);
                content.appendChild(description);
                content.appendChild(date);
                content.appendChild(deleteButton);

                card.appendChild(content);

                myBlogsContainer.appendChild(card);

            });
        }
    }
}



// Display the selected full blog
const fullBlogContent = document.getElementById("fullBlogContent");

if (fullBlogContent) {

    const selectedBlog = JSON.parse(
        localStorage.getItem("currentReadingBlog")
    );

    const currentTitle = localStorage.getItem("currentReadingTitle");

    const blogs = JSON.parse(localStorage.getItem("blogs")) || [];

    let blog = selectedBlog;

    // Find a previously published blog if available
    if (!blog && currentTitle) {
        blog = blogs.find(function(item) {
            return item.title === currentTitle;
        });
    }

    if (blog) {

        document.getElementById("fullBlogTitle").textContent = blog.title;
        document.getElementById("fullBlogCategory").textContent =
            "Category: " + blog.category;

        document.getElementById("fullBlogAuthor").textContent =
            "Author: " + (blog.author || "BlogSpace");

        document.getElementById("fullBlogDate").textContent =
            "Published: " + (blog.date || "");

        document.getElementById("fullBlogDescription").textContent =
            blog.description;

        if (blog.image) {
            const image = document.getElementById("fullBlogImage");
            image.src = blog.image;
            image.style.display = "block";
        }

    } else {

        fullBlogContent.hidden = true;
        document.getElementById("blogNotFound").hidden = false;

    }
}
