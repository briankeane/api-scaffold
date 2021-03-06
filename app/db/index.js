const Sequelize = require("sequelize");
const logger = require("../logger");
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: process.env.NODE_ENV === "test" ? false : logger.log,
});
const User = require("./models/user.model");
const SpotifyUser = require("./models/spotifyUser.model");
const AudioBlock = require("./models/audioBlock.model");
const StationSong = require("./models/stationSong.model/stationSong.model");
const Spin = require("./models/spin.model/spin.model");

/*
 * AudioBlock sub-models
 */
const Song = AudioBlock.scope("songs");
Song.create = (attrs) => AudioBlock.create({ ...attrs, ...{ type: "song" } });

const Commercial = AudioBlock.scope("commercials");
Commercial.create = (attrs) =>
  AudioBlock.create({
    ...{ title: "Commercial", artist: "------" }, // defaults
    ...attrs,
    ...{ type: "commercial" },
  });

const Voicetrack = AudioBlock.scope("voicetracks");
Voicetrack.create = (attrs) =>
  AudioBlock.create({
    ...{ title: "Voicetrack", artist: "------" }, // defaults
    ...attrs,
    ...{ type: "voicetrack" },
  });

StationSong.findAllActive = async ({ userId }) => {
  return await StationSong.findAll({
    where: { userId: userId },
    include: [
      {
        model: Song,
        as: "song",
        where: { audioUrl: { [Sequelize.Op.ne]: null } },
      },
    ],
  });
};

Spin.getPlaylist = async ({ userId }) => {
  return await Spin.findAll({
    where: { userId },
    order: [["playlistPosition", "ASC"]],
    include: [{ model: AudioBlock }],
  });
};

/*
 * Relationships
 */
User.belongsToMany(AudioBlock, { through: StationSong });
AudioBlock.belongsToMany(User, {
  through: StationSong,
  foreignKey: "songId",
  alias: "song",
});
User.hasMany(StationSong, { onDelete: "CASCADE" });
AudioBlock.hasMany(StationSong, {
  onDelete: "CASCADE",
  foreignKey: "songId",
  alias: "song",
});
StationSong.belongsTo(User);
StationSong.belongsTo(AudioBlock, { foreignKey: "songId", as: "song" });

Spin.belongsTo(User);
Spin.belongsTo(AudioBlock);
User.hasMany(Spin);

const models = {
  User,
  SpotifyUser,
  AudioBlock,
  Song,
  Commercial,
  Voicetrack,
  StationSong,
  Spin,
};

module.exports = {
  sequelize,
  db: sequelize,
  models,
};
