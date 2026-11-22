
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



const API_URL = "http://localhost:5000/api";

// =====================================
// REGISTER PAGE FUNCTIONALITY
// =====================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function(event) {

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

        try {

            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Registration failed!");
                return;
            }

            alert("Registration successful! Please login.");

            registerForm.reset();

            window.location.href = "login.html";

        } catch (error) {

            console.error("Registration error:", error);
            alert("Unable to connect to the backend server!");

        }

    });

}



const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;

        try {

            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Invalid email or password!");
                return;
            }

            // Save login information
            localStorage.setItem("token", data.token);

            localStorage.setItem("loggedInUser", JSON.stringify(data.user));

            alert("Login successful!");

            window.location.href = "dashboard.html";

        } catch (error) {

            console.error("Login error:", error);
            alert("Unable to connect to the backend server!");

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



const createBlogForm = document.getElementById("createBlogForm");

// =====================================
// CREATE BLOG USING BACKEND API
// =====================================

if (createBlogForm) {

    createBlogForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const title = document.getElementById("blogTitle").value.trim();
        const category = document.getElementById("blogCategory").value;
        const description = document.getElementById("blogDescription").value.trim();

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login before publishing a blog!");
            window.location.href = "login.html";
            return;
        }

        if (!title || !category || !description) {
            alert("Please fill all required fields!");
            return;
        }

        try {

            const response = await fetch(`${API_URL}/blogs`, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },

                body: JSON.stringify({
                    title: title,
                    category: category,
                    description: description,
                    image: ""
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Blog creation failed!");
                return;
            }

            alert("Blog published successfully!");

            createBlogForm.reset();

            window.location.href = "index.html";

        } catch (error) {

            console.error("Create blog error:", error);
            alert("Unable to connect to backend server!");

        }

    });

}




// Display blogs published by users on the Home Page

// =====================================
// DISPLAY BLOGS FROM MONGODB
// =====================================

async function displayPublishedBlogs() {

    const blogContainer = document.getElementById("blogContainer");

    if (!blogContainer) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/blogs`);

        const blogs = await response.json();

        if (!response.ok) {
            throw new Error("Unable to fetch blogs");
        }

        blogs.forEach(function(blog) {

            const article = document.createElement("article");
            article.className = "blog-card";

            article.dataset.category = blog.category || "";
            article.dataset.title = blog.title || "";

            // Image section
            const imageBox = document.createElement("div");
            imageBox.className = "blog-image";

            if (blog.image) {
                const image = document.createElement("img");
                image.src = blog.image;
                image.alt = blog.title;
                image.style.width = "100%";
                image.style.height = "100%";
                image.style.objectFit = "cover";
                imageBox.appendChild(image);
            }

            const categoryLabel = document.createElement("span");
            categoryLabel.textContent =
                (blog.category || "BLOG").toUpperCase();

            imageBox.appendChild(categoryLabel);

            // Content section
            const content = document.createElement("div");
            content.className = "blog-content";

            const heading = document.createElement("h3");
            heading.textContent = blog.title;

            const description = document.createElement("p");
            description.textContent = blog.description;

            const author = document.createElement("p");
            author.textContent =
                "By " + (blog.author?.name || "Unknown");

            const date = document.createElement("p");
            date.textContent =
                "Published: " +
                new Date(blog.createdAt).toLocaleDateString();

            const readButton = document.createElement("button");
            readButton.textContent = "Read More →";

            readButton.addEventListener("click", function() {

                localStorage.setItem(
                    "currentReadingBlog",
                    JSON.stringify(blog)
                );

                window.location.href = "read-blog.html";

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

    } catch (error) {

        console.error("Fetch blogs error:", error);
        alert("Unable to load blogs from the server.");

    }
}

// Load blogs when Home Page opens
displayPublishedBlogs();



// =====================================
// DISPLAY MY BLOGS FROM BACKEND
// =====================================

const myBlogsContainer = document.getElementById("myBlogsContainer");

if (myBlogsContainer) {

    async function loadMyBlogs() {

        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "login.html";
            return;
        }

        try {

            const response = await fetch(`${API_URL}/blogs/my-blogs`, {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            });

            const blogs = await response.json();

            if (!response.ok) {
                alert(blogs.message || "Unable to load your blogs.");
                return;
            }

            myBlogsContainer.innerHTML = "";

            const message = document.getElementById("myBlogsMessage");

            if (blogs.length === 0) {
                if (message) message.hidden = false;
                return;
            }

            if (message) message.hidden = true;

            blogs.forEach(function(blog) {

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
                date.textContent = "Published: " +
                    new Date(blog.createdAt).toLocaleDateString();

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete Blog";

                deleteButton.addEventListener("click", async function() {

                    const confirmDelete = confirm(
                        "Are you sure you want to delete this blog?"
                    );

                    if (!confirmDelete) return;

                    try {

                        const deleteResponse = await fetch(
                            `${API_URL}/blogs/${blog._id}`,
                            {
                                method: "DELETE",
                                headers: {
                                    "Authorization": "Bearer " + token
                                }
                            }
                        );

                        const result = await deleteResponse.json();

                        if (!deleteResponse.ok) {
                            alert(result.message || "Delete failed!");
                            return;
                        }

                        alert("Blog deleted successfully!");

                        loadMyBlogs();

                    } catch (error) {

                        console.error("Delete error:", error);
                        alert("Unable to delete blog.");

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

        } catch (error) {

            console.error("My Blogs error:", error);
            alert("Unable to connect to backend.");

        }

    }

    loadMyBlogs();

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
