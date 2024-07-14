# Use an official Node.js runtime as a parent image
FROM node:20.11.1

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Install necessary dependencies for building Python
RUN apt-get update && \
    apt-get install -y wget build-essential libssl-dev zlib1g-dev \
                       libncurses5-dev libncursesw5-dev libreadline-dev \
                       libsqlite3-dev libffi-dev libbz2-dev && \
    rm -rf /var/lib/apt/lists/*

# Download Python 3.12.2 source, build, and install
RUN wget https://www.python.org/ftp/python/3.12.2/Python-3.12.2.tgz && \
    tar xzf Python-3.12.2.tgz && \
    cd Python-3.12.2 && \
    ./configure --enable-optimizations && \
    make altinstall && \
    ln -s /usr/local/bin/python3.12 /usr/bin/python3 && \
    cd .. && \
    rm -rf Python-3.12.2* && \
    apt-get clean

# Copy requirements.txt and install Python dependencies
COPY requirements.txt .
RUN python3.12 -m pip install --no-cache-dir -r requirements.txt

# Expose port 3000 (or whichever port your Node.js app runs on)
EXPOSE 3000

# Command to run your Node.js application
CMD ["node", "index.js"]
