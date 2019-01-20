# Using Ubuntu latest as base image.
FROM node:latest

# Label base
LABEL gameboy latest

# Build dependencies
RUN apt-get update
RUN apt-get install -y git

# Create non-root user
RUN useradd -m gameboy && adduser gameboy sudo && echo "gameboy:gameboy" | chpasswd

USER gameboy
WORKDIR /home/gameboy
ENV HOME /home/gameboy

USER gameboy
RUN git clone https://github.com/alanvivona/gameboy.git ~/gameboy
RUN npm install
RUN chmod 700 ~/gameboy/cli/cli
ENV PATH="/home/gameboy/gameboy:${PATH}"

# Cleanup
USER root
RUN apt-get autoremove --purge -y && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Base command for container
USER gameboy
# ENTRYPOINT ./home/gameboy/gameboy/cli/cli