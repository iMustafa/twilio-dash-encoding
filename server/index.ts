require('dotenv').config();
import express, { Request, Response } from "express";
import next from "next";
import cors from 'cors';
import "puppeteer-stream";
import puppeteer from "puppeteer";
import * as fs from "fs";
import * as socketio from "socket.io";
import routes from "./routes";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

(async () => {
  try {
    await app.prepare();
    const expressServer = express();

    expressServer.use(cors());
    expressServer.use(express.json());
    expressServer.use(express.urlencoded({ extended: true }));

    expressServer.use("/api", routes);

    expressServer.all("*", (req: Request, res: Response) => {
      return handle(req, res);
    });

    const http = require("http").Server(expressServer);
    const io = require("socket.io")(http);

    io.on('connection', (client: socketio.Socket) => {
      client.on('start-recording', async ({ room, identity }) => {
        console.log('>> NEW RECORDING', room, identity);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(`http://localhost:3000?room=${room}&identity=${identity}`);
        const stream = await page.getStream({ audio: true, video: true });
        console.log("recording");

        const file = fs.createWriteStream(__dirname + `/${room}.webm`);

        stream.pipe(file);
        setTimeout(async () => {
          await stream.destroy();
          file.close();
          console.log("finished");
        }, 5000 * 10);
      })

      client.on('disconnect', () => {

      });
    })


    http.listen(port, async (err?: any) => {
      if (err) throw err;
      console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
    });
  } catch (e) {
    process.exit(0)
  }
})();