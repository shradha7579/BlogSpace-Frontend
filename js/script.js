
console.log("BlogSpace application started successfully!");

const API_URL = "http://localhost:5000/api";

// =====================================
// HELPER FUNCTIONS
// =====================================

function getToken() {
    return localStorage.getItem("token");
}

function getLoggedInUser() {
    try {
        return JSON.parse(localStorage.getItem("loggedInUser"));
    } catch (error) {
        return null;
    }
}

function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("currentReadingBlog");
    localStorage.removeItem("currentReadingTitle");
    window.location.href = "login.html";
}

// Verify token and get the actual logged-in user
async function verifyLogin() {
    const token = getToken();

    if (!token) {
        logoutUser();
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok) {
            logoutUser();
            return null;
        }

        const data = await response.json();

        if (!data.user) {
            logoutUser();
            return null;
        }

        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(data.user)
        );

        return data.user;

    } catch (error) {
        console.error("Authentication error:", error);
        alert("Unable to connect to the server. Please try again.");
        return null;
    }
}


// =====================================
// READ BLOG FUNCTION
// =====================================

function readBlog(title) {
    localStorage.setItem("currentReadingTitle", title);
    localStorage.removeItem("currentReadingBlog");
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
        const cardCategory =
            (card.dataset.category || "").toLowerCase();

        if (
            category.toLowerCase() === "all" ||
            cardCategory === category.toLowerCase()
        ) {
            card.style.display = "block";
            found++;
        } else {
            card.style.display = "none";
        }
    });

    document.querySelectorAll(".category-btn").forEach(function(btn) {
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
// SEARCH USING ENTER KEY
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
// REGISTER FUNCTIONALITY
// =====================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (!name || !email || !password || !confirmPassword) {
            alert("Please fill all fields!");
            return;
        }

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


// =====================================
// LOGIN FUNCTIONALITY
// =====================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;

        if (!email || !password) {
            alert("Please enter email and password!");
            return;
        }

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

            localStorage.setItem("token", data.token);
            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(data.user)
            );

            alert("Login successful!");
            window.location.href = "dashboard.html";

        } catch (error) {
            console.error("Login error:", error);
            alert("Unable to connect to the backend server!");
        }
    });
}


// =====================================
// DASHBOARD AND PROFILE
// =====================================

const welcomeMessage = document.getElementById("welcomeMessage");

if (welcomeMessage) {
    async function loadDashboardProfile() {
        const user = await verifyLogin();

        if (!user) return;

        welcomeMessage.textContent =
            "Hello, " + user.name + "! Welcome to BlogSpace.";

        const profileName = document.getElementById("profileName");

        if (profileName) {
            profileName.textContent = user.name;
        }

        const profileEmail = document.getElementById("profileEmail");

        if (profileEmail) {
            profileEmail.textContent = user.email;
        }
    }

    loadDashboardProfile();
}


// =====================================
// LOGOUT FUNCTIONALITY
// =====================================

const logoutLink = document.getElementById("logoutLink");

if (logoutLink) {
    logoutLink.addEventListener("click", function(event) {
        event.preventDefault();

        alert("You have logged out successfully!");
        logoutUser();
    });
}


// =====================================
// CREATE BLOG FUNCTIONALITY
// =====================================

const createBlogForm = document.getElementById("createBlogForm");

if (createBlogForm) {
    createBlogForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const title = document.getElementById("blogTitle").value.trim();
        const category = document.getElementById("blogCategory").value;
        const description =
            document.getElementById("blogDescription").value.trim();

        const token = getToken();

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

            if (response.status === 401) {
                alert("Your login session has expired. Please login again.");
                logoutUser();
                return;
            }

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


// =====================================
// DISPLAY ALL BLOGS ON HOME PAGE
// =====================================

async function displayPublishedBlogs() {
    const blogContainer = document.getElementById("blogContainer");

    if (!blogContainer) return;

    try {
        const response = await fetch(`${API_URL}/blogs`);
        const blogs = await response.json();

        if (!response.ok) {
            throw new Error(blogs.message || "Unable to fetch blogs");
        }

        blogContainer.innerHTML = "";

        if (blogs.length === 0) {
            blogContainer.textContent = "No blogs published yet.";
            return;
        }

        blogs.forEach(function(blog) {
            const card = document.createElement("div");
            card.className = "blog-card";

            card.dataset.title = blog.title || "";
            card.dataset.category = blog.category || "";

            const content = document.createElement("div");
            content.className = "blog-content";

            if (blog.image) {
                const image = document.createElement("img");
                image.src = blog.image;
                image.alt = blog.title || "Blog image";
                image.style.maxWidth = "100%";
                content.appendChild(image);
            }

            const heading = document.createElement("h3");
            heading.textContent = blog.title || "";

            const category = document.createElement("p");
            category.textContent = "Category: " + (blog.category || "");

            const description = document.createElement("p");
            description.textContent = blog.description || "";

            const author = document.createElement("p");

            const authorName =
                blog.author && typeof blog.author === "object"
                    ? blog.author.name
                    : blog.author;

            author.textContent = "Author: " + (authorName || "BlogSpace");

            const date = document.createElement("p");
            date.textContent = "Published: " +
                (blog.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString()
                    : "");

            const readButton = document.createElement("button");
            readButton.type = "button";
            readButton.textContent = "Read More";

            readButton.addEventListener("click", function() {
                localStorage.setItem(
                    "currentReadingBlog",
                    JSON.stringify(blog)
                );

                localStorage.removeItem("currentReadingTitle");
                window.location.href = "read-blog.html";
            });

            content.appendChild(heading);
            content.appendChild(category);
            content.appendChild(description);
            content.appendChild(author);
            content.appendChild(date);
            content.appendChild(readButton);

            card.appendChild(content);
            blogContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Fetch blogs error:", error);
        blogContainer.textContent = "Unable to load blogs from the server.";
    }
}

displayPublishedBlogs();


// =====================================
// DISPLAY MY BLOGS
// =====================================

const myBlogsContainer = document.getElementById("myBlogsContainer");

async function loadMyBlogs() {
    if (!myBlogsContainer) return;

    const token = getToken();

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

        if (response.status === 401) {
            alert("Your login session has expired. Please login again.");
            logoutUser();
            return;
        }

        if (!response.ok) {
            alert(blogs.message || "Unable to load your blogs.");
            return;
        }

        myBlogsContainer.innerHTML = "";

        const message = document.getElementById("myBlogsMessage");

        if (blogs.length === 0) {
            if (message) {
                message.hidden = false;
            } else {
                myBlogsContainer.textContent =
                    "You have not published any blogs yet.";
            }
            return;
        }

        if (message) {
            message.hidden = true;
        }

        blogs.forEach(function(blog) {
            const card = document.createElement("div");
            card.className = "blog-card";

            card.dataset.title = blog.title || "";
            card.dataset.category = blog.category || "";

            const content = document.createElement("div");
            content.className = "blog-content";

            const title = document.createElement("h3");
            title.textContent = blog.title || "";

            const category = document.createElement("p");
            category.textContent = "Category: " + (blog.category || "");

            const description = document.createElement("p");
            description.textContent = blog.description || "";

            const date = document.createElement("p");
            date.textContent = "Published: " +
                (blog.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString()
                    : "");

            const editButton = document.createElement("button");
            editButton.type = "button";
            editButton.textContent = "Edit Blog";

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "Delete Blog";

            // EDIT FORM
            const editForm = document.createElement("form");
            editForm.hidden = true;
            editForm.style.marginTop = "15px";

            const titleInput = document.createElement("input");
            titleInput.type = "text";
            titleInput.value = blog.title || "";
            titleInput.required = true;
            titleInput.placeholder = "Blog Title";
            titleInput.style.width = "100%";
            titleInput.style.marginBottom = "10px";

            const categoryInput = document.createElement("input");
            categoryInput.type = "text";
            categoryInput.value = blog.category || "";
            categoryInput.required = true;
            categoryInput.placeholder = "Category";
            categoryInput.style.width = "100%";
            categoryInput.style.marginBottom = "10px";

            const descriptionInput = document.createElement("textarea");
            descriptionInput.value = blog.description || "";
            descriptionInput.required = true;
            descriptionInput.placeholder = "Blog Description";
            descriptionInput.rows = 6;
            descriptionInput.style.width = "100%";
            descriptionInput.style.marginBottom = "10px";

            const saveButton = document.createElement("button");
            saveButton.type = "submit";
            saveButton.textContent = "Save Changes";

            const cancelButton = document.createElement("button");
            cancelButton.type = "button";
            cancelButton.textContent = "Cancel";

            editButton.addEventListener("click", function() {
                editForm.hidden = false;
                editButton.hidden = true;
            });

            cancelButton.addEventListener("click", function() {
                editForm.hidden = true;
                editButton.hidden = false;
            });

            // UPDATE BLOG
            editForm.addEventListener("submit", async function(event) {
                event.preventDefault();

                const updatedTitle = titleInput.value.trim();
                const updatedCategory = categoryInput.value.trim();
                const updatedDescription = descriptionInput.value.trim();

                if (
                    !updatedTitle ||
                    !updatedCategory ||
                    !updatedDescription
                ) {
                    alert("Please fill all fields!");
                    return;
                }

                try {
                    const updateResponse = await fetch(
                        `${API_URL}/blogs/${blog._id}`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer " + token
                            },
                            body: JSON.stringify({
                                title: updatedTitle,
                                category: updatedCategory,
                                description: updatedDescription
                            })
                        }
                    );

                    const result = await updateResponse.json();

                    if (updateResponse.status === 401) {
                        alert("Your login session has expired. Please login again.");
                        logoutUser();
                        return;
                    }

                    if (!updateResponse.ok) {
                        alert(result.message || "Blog update failed!");
                        return;
                    }

                    alert("Blog updated successfully!");
                    loadMyBlogs();

                } catch (error) {
                    console.error("Update error:", error);
                    alert("Unable to update blog.");
                }
            });

            // DELETE BLOG
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

                    if (deleteResponse.status === 401) {
                        alert("Your login session has expired. Please login again.");
                        logoutUser();
                        return;
                    }

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

            editForm.appendChild(titleInput);
            editForm.appendChild(categoryInput);
            editForm.appendChild(descriptionInput);
            editForm.appendChild(saveButton);
            editForm.appendChild(cancelButton);

            content.appendChild(title);
            content.appendChild(category);
            content.appendChild(description);
            content.appendChild(date);
            content.appendChild(editButton);
            content.appendChild(deleteButton);
            content.appendChild(editForm);

            card.appendChild(content);
            myBlogsContainer.appendChild(card);
        });

    } catch (error) {
        console.error("My Blogs error:", error);
        alert("Unable to connect to backend.");
    }
}

if (myBlogsContainer) {
    loadMyBlogs();
}


// =====================================
// DISPLAY INDIVIDUAL BLOG DETAILS
// =====================================

const fullBlogContent = document.getElementById("fullBlogContent");

if (fullBlogContent) {
    async function loadFullBlog() {
        let selectedBlog = null;

        try {
            selectedBlog = JSON.parse(
                localStorage.getItem("currentReadingBlog")
            );
        } catch (error) {
            selectedBlog = null;
        }

        const currentTitle =
            localStorage.getItem("currentReadingTitle");

        // If blog is not already stored, fetch it from backend
        if (!selectedBlog && currentTitle) {
            try {
                const response = await fetch(`${API_URL}/blogs`);
                const blogs = await response.json();

                if (response.ok && Array.isArray(blogs)) {
                    selectedBlog = blogs.find(function(blog) {
                        return blog.title === currentTitle;
                    });
                }
            } catch (error) {
                console.error("Read blog error:", error);
            }
        }

        if (!selectedBlog) {
            fullBlogContent.hidden = true;

            const notFound = document.getElementById("blogNotFound");

            if (notFound) {
                notFound.hidden = false;
            }
            return;
        }

        document.getElementById("fullBlogTitle").textContent =
            selectedBlog.title || "";

        document.getElementById("fullBlogCategory").textContent =
            "Category: " + (selectedBlog.category || "");

        const authorName =
            selectedBlog.author &&
            typeof selectedBlog.author === "object"
                ? selectedBlog.author.name
                : selectedBlog.author;

        document.getElementById("fullBlogAuthor").textContent =
            "Author: " + (authorName || "BlogSpace");

        document.getElementById("fullBlogDate").textContent =
            "Published: " +
            (selectedBlog.createdAt
                ? new Date(selectedBlog.createdAt).toLocaleDateString()
                : "");

        document.getElementById("fullBlogDescription").textContent =
            selectedBlog.description || "";

        const image = document.getElementById("fullBlogImage");

        if (image) {
            if (selectedBlog.image) {
                image.src = selectedBlog.image;
                image.alt = selectedBlog.title || "Blog image";
                image.style.display = "block";
            } else {
                image.style.display = "none";
            }
        }

        localStorage.setItem(
            "currentReadingBlog",
            JSON.stringify(selectedBlog)
        );
    }

    loadFullBlog();
}
