FROM golang:1.19.3-alpine3.16

WORKDIR /hub

ADD ./hub .

COPY ./shared-types ../shared-types
COPY ./utils ../utils

RUN go build -o hub

EXPOSE 4545

# Run web server
CMD [ "/hub/hub" ]
