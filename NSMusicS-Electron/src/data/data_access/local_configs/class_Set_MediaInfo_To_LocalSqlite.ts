import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
import {store_app_configs_info} from "@/data/data_stores/app/store_app_configs_info";
import { isElectron } from '@/utils/electron/isElectron';

export class Set_MediaInfo_To_LocalSqlite {
    private getUniqueId(db: any) {
        if(isElectron) {
            const {v4: uuidv4} = require('uuid');
            let ann_id = uuidv4();
            while (db.prepare(`SELECT COUNT(*)
                               FROM ${store_server_user_model.annotation}
                               WHERE ann_id = ?`).pluck().get(ann_id) > 0) {
                ann_id = uuidv4();
            }
            return ann_id;
        } else {
            // other
        }
        return undefined
    }
    private getCurrentDateTime() {
        return new Date().toLocaleString(
            'zh-CN', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
            }
        ).replace(/\//g, '-');
    }

    public Set_MediaInfo_To_Favorite_Local(id: string, value: Boolean) {
        if(isElectron) {
            let ann_id = null;
            const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
            db.pragma('journal_mode = WAL');
            db.exec('PRAGMA foreign_keys = OFF');

            const existingRecord = db.prepare(`SELECT *
                                               FROM ${store_server_user_model.annotation}
                                               WHERE item_id = ?`).get(id);
            if (!existingRecord) {
                db.prepare(`
                    INSERT INTO ${store_server_user_model.annotation} (ann_id, item_id, item_type, starred, starred_at)
                    VALUES (?, ?, ?, ?, ?)`)
                    .run(
                        this.getUniqueId(db), id, 'media_file', value ? 0 : 1,
                        this.getCurrentDateTime(),);
            } else {
                db.prepare(`
                    UPDATE ${store_server_user_model.annotation}
                    SET starred    = ?,
                        starred_at = ?
                    WHERE item_id = ?
                      AND item_type = 'media_file'`)
                    .run(
                        value ? 0 : 1,
                        this.getCurrentDateTime(),
                        id,);
            }

            db.close();
            return true
        } else {
            // other
        }
        return undefined
    }
    public Set_MediaInfo_To_Rating_Local(id: any, value: number) {
        if(isElectron) {
            let ann_id = null;
            const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
            db.pragma('journal_mode = WAL');
            db.exec('PRAGMA foreign_keys = OFF');

            const existingRecord = db.prepare(`SELECT *
                                               FROM ${store_server_user_model.annotation}
                                               WHERE item_id = ?`).get(id);
            if (!existingRecord) {
                db.prepare(`INSERT INTO ${store_server_user_model.annotation} (ann_id, item_id, item_type, rating)
                            VALUES (?, ?, ?, ?)`)
                    .run(this.getUniqueId(db), id, 'media_file', value);
            } else {
                db.prepare(`UPDATE ${store_server_user_model.annotation}
                            SET rating = ?
                            WHERE item_id = ?
                              AND item_type = 'media_file'`)
                    .run(value, id);
            }

            db.close();
        } else {
            // other
        }
    }
    public Set_MediaInfo_To_PlayCount_of_Media_File_Local(item_id: any) {
        if(isElectron) {
            const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
            db.pragma('journal_mode = WAL');
            db.exec('PRAGMA foreign_keys = OFF');

            let existingRecord = db.prepare(`SELECT play_count
                                             FROM ${store_server_user_model.annotation}
                                             WHERE item_id = ?`).get(item_id);
            if (!existingRecord) {
                db.prepare(`INSERT INTO ${store_server_user_model.annotation} (ann_id, item_id, item_type, play_count, play_date)
                            VALUES (?, ?, ?, ?, ?)`)
                    .run(this.getUniqueId(db), item_id, 'media_file', 1, this.getCurrentDateTime());
            } else {
                existingRecord.play_count += 1;
                db.prepare(`UPDATE ${store_server_user_model.annotation}
                            SET play_count = ?,
                                play_date  = ?
                            WHERE item_id = ?
                              AND item_type = 'media_file'`)
                    .run(existingRecord.play_count, this.getCurrentDateTime(), item_id);
            }
            db.close();
        } else {
            // other
        }
    }
    public Set_MediaInfo_To_PlayCount_of_Media_File_ND(item_id: any, play_count: number, play_date: string) {
        if(isElectron) {
            const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
            db.pragma('journal_mode = WAL');
            db.exec('PRAGMA foreign_keys = OFF');

            let existingRecord = db.prepare(`SELECT play_count
                                             FROM ${store_server_user_model.annotation}
                                             WHERE item_id = ?`).get(item_id);
            if (!existingRecord) {
                db.prepare(`INSERT INTO ${store_server_user_model.annotation} (ann_id, item_id, item_type, play_count, play_date)
                            VALUES (?, ?, ?, ?, ?)`)
                    .run(this.getUniqueId(db), item_id, 'media_file', 1, play_date);
            } else {
                db.prepare(`UPDATE ${store_server_user_model.annotation}
                            SET play_count = ?,
                                play_date  = ?
                            WHERE item_id = ?
                              AND item_type = 'media_file'`)
                    .run(play_count, play_date, item_id);
            }
            db.close();
        } else {
            // other
        }
    }
    public Set_MediaInfo_Add_Selected_Playlist_Local(media_file_id: any, playlist_id: any) {
        if(isElectron) {
            const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
            db.pragma('journal_mode = WAL');
            db.exec('PRAGMA foreign_keys = OFF');

            const existingRecord = db.prepare(`SELECT *
                                               FROM ${store_server_user_model.playlist_tracks}
                                               WHERE playlist_id = ?
                                                 AND media_file_id = ?`).get(playlist_id, media_file_id);
            if (!existingRecord) {
                db.prepare(`INSERT INTO ${store_server_user_model.playlist_tracks} (id, playlist_id, media_file_id)
                            VALUES (?, ?, ?)`)
                    .run(this.getUniqueId(db), playlist_id, media_file_id);
                db.close();
                return true;
            } else {
                db.close();
                return false;
            }
        } else {
            // other
        }
        return undefined
    }
    public Set_MediaInfo_Delete_Selected_Playlist_Local(media_file_id: any, playlist_id: any) {
        if(isElectron) {
            const db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
            db.pragma('journal_mode = WAL');
            db.exec('PRAGMA foreign_keys = OFF');

            const existingRecord = db.prepare(`SELECT *
                                               FROM ${store_server_user_model.playlist_tracks}
                                               WHERE playlist_id = ?
                                                 AND media_file_id = ?`).get(playlist_id, media_file_id);
            if (existingRecord) {
                db.prepare(`DELETE
                            FROM ${store_server_user_model.playlist_tracks}
                            WHERE playlist_id = ?
                              AND media_file_id = ?`).run(playlist_id, media_file_id);
                db.close();
                return true;
            } else {
                db.close();
                return false;
            }
        } else {
            // other
        }
        return undefined
    }
}