FROM golang:1.19.3-bullseye

WORKDIR /hub

ADD ./hub .

COPY ./shared-types ../shared-types
COPY ./utils ../utils

# Compile ./hub./hub//code
RUN go build -o hub

EXPOSE 4545

# Run web server
CMD [ "/hub/hub" ]
