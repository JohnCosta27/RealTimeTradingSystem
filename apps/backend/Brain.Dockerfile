FROM golang:1.19.3-alpine3.16

WORKDIR /brain

ADD ./brain .

COPY ./shared-types ../shared-types
COPY ./utils ../utils

RUN go build -o brain

EXPOSE 4545

CMD [ "/brain/brain" ]
