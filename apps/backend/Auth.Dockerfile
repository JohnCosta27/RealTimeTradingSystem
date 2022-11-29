FROM golang:1.19.3-alpine3.16

WORKDIR /auth

ADD ./auth .

COPY ./shared-types ../shared-types
COPY ./utils ../utils

RUN go build -o auth

EXPOSE 4546

CMD [ "/auth/auth" ]
