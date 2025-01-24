import { reactive } from 'vue'
import {store_router_data_logic} from "@/router/router_store/store_router_data_logic";
import {store_router_data_info} from "@/router/router_store/store_router_data_info";
import {store_app_configs_info} from "@/data/data_stores/app/store_app_configs_info";
import {store_router_history_data_of_album} from "@/router/router_store/store_router_history_data_of_album";
import {store_view_album_page_logic} from "./store_view_album_page_logic"
import {store_server_user_model} from "@/data/data_stores/server/store_server_user_model";
import {store_view_album_page_info} from "./store_view_album_page_info";
import {store_player_appearance} from "../../page_player/store/store_player_appearance";
import {store_view_media_page_logic} from "../../page_media/store/store_view_media_page_logic";
import {store_view_media_page_info} from "../../page_media/store/store_view_media_page_info";
import {store_view_media_page_fetchData} from "../../page_media/store/store_view_media_page_fetchData";
import {store_playlist_list_info} from "../../../music_components/player_list/store/store_playlist_list_info"
import {store_player_audio_info} from "../../page_player/store/store_player_audio_info";
import {store_playlist_list_logic} from "../../../music_components/player_list/store/store_playlist_list_logic"
import {
    Get_Navidrome_Temp_Data_To_LocalSqlite
} from "../../../../../data/data_access/servers_configs/navidrome_api/services_web_instant_access/class_Get_Navidrome_Temp_Data_To_LocalSqlite";
import {store_server_users} from "@/data/data_stores/server/store_server_users";
import {store_playlist_list_fetchData} from "../../../music_components/player_list/store/store_playlist_list_fetchData";
import {store_player_tag_modify} from "../../page_player/store/store_player_tag_modify";
import error_album from '@/assets/img/error_album.jpg'
import { isElectron } from '@/utils/electron/isElectron';

export const store_view_album_page_fetchData = reactive({
    async fetchData_Album(){
        if(isElectron) {
            if (store_server_user_model.model_server_type_of_local) {
                let db: any = null;
                let moment = require('moment');
                // clear RouterView of vue-virtual-scroller data
                if (store_player_appearance.player_mode_of_medialist_from_external_import) {
                    store_player_appearance.player_mode_of_medialist_from_external_import = false;
                } else {
                    store_router_data_logic.clear_Files_temporary()
                    store_router_data_info.router_select_model_album = true;
                }

                try {
                    db = require('better-sqlite3')(store_app_configs_info.navidrome_db);
                    db.pragma('journal_mode = WAL');
                    db.exec('PRAGMA foreign_keys = OFF');

                    let stmt_album = null;
                    let stmt_album_string = '';

                    // load album_Files_temporary data
                    if (store_router_history_data_of_album.router_history_model_of_Album === 0) {
                        const sortKey = store_view_album_page_logic.page_albumlists_options_Sort_key.length > 0 && store_view_album_page_logic.page_albumlists_options_Sort_key[0].order !== 'default' ?
                            store_view_album_page_logic.page_albumlists_options_Sort_key[0].columnKey : 'id';
                        const sortOrder = store_view_album_page_logic.page_albumlists_options_Sort_key.length > 0 && store_view_album_page_logic.page_albumlists_options_Sort_key[0].order !== 'default' ?
                            store_view_album_page_logic.page_albumlists_options_Sort_key[0].order.replace('end', '') : '';
                        let keywordFilter = store_view_album_page_logic.page_albumlists_keyword.length > 0 ?
                            `WHERE id LIKE '%${store_view_album_page_logic.page_albumlists_keyword}%' 
                            OR name LIKE '%${store_view_album_page_logic.page_albumlists_keyword}%' 
                            OR artist LIKE '%${store_view_album_page_logic.page_albumlists_keyword}%' 
                            OR artist_id LIKE '%${store_view_album_page_logic.page_albumlists_keyword}%' 
                            OR created_at LIKE '%${store_view_album_page_logic.page_albumlists_keyword}%'` :
                            '';
                        if (store_router_data_info.find_album_model) {
                            if (store_view_album_page_logic.page_albumlists_get_keyword_model_num != 1)
                                keywordFilter = `WHERE artist_id = '${store_view_album_page_logic.page_albumlists_keyword}'`
                            else
                                keywordFilter = `WHERE created_at LIKE '${store_view_album_page_logic.page_albumlists_keyword}'`
                            store_router_data_info.find_album_model = false;
                        } else {
                            if (store_view_album_page_logic.page_albumlists_get_keyword_model_num != 0) {
                                if (keywordFilter.length > 0) {
                                    keywordFilter = keywordFilter.replace('LIKE', '=').replace(/%/g, '').replace('artist', 'artist_id');
                                }
                            }
                        }
                        if (
                            store_view_album_page_logic.page_albumlists_filter_year != 0 &&
                            store_view_album_page_logic.page_albumlists_filter_year != undefined &&
                            store_view_album_page_logic.page_albumlists_filter_year != 'undefined'
                        ) {
                            keywordFilter = this.addCondition(
                                keywordFilter,
                                `min_year = ${store_view_album_page_logic.page_albumlists_filter_year}`
                            );
                        }
                        stmt_album_string = `SELECT *
                                             FROM ${store_server_user_model.album} ${keywordFilter}
                                             ORDER BY ${sortKey} ${sortOrder}`;
                        stmt_album = db.prepare(stmt_album_string);
                        //////
                        if(!store_view_album_page_logic.page_albumlists_filter_model) {
                            if (store_router_history_data_of_album.router_select_history_date_of_Album && store_view_album_page_logic.page_albumlists_keyword_reset) {
                                store_router_history_data_of_album.remove_router_history_of_Album(store_router_history_data_of_album.router_select_history_date_of_Album.id);// 若存在新操作，则覆盖后续的路由
                                store_view_album_page_logic.page_albumlists_keyword_reset = false;
                            }
                            const routerDate: Interface_View_Router_Date = {
                                id: 0,
                                menu_select_active_key: 'album',
                                router_name: 'album',
                                router_select_model_media: false,
                                router_select_model_album: true,
                                router_select_model_artist: false,
                                page_lists_keyword: store_view_album_page_logic.page_albumlists_keyword,
                                stmt_string: stmt_album_string,
                                page_lists_selected: store_view_album_page_logic.page_albumlists_selected,
                                columnKey: store_view_album_page_logic.page_albumlists_options_Sort_key.length > 0 && store_view_album_page_logic.page_albumlists_options_Sort_key[0].order !== 'default' ?
                                    store_view_album_page_logic.page_albumlists_options_Sort_key[0].columnKey : 'id',
                                order: store_view_album_page_logic.page_albumlists_options_Sort_key.length > 0 && store_view_album_page_logic.page_albumlists_options_Sort_key[0].order !== 'default' ?
                                    store_view_album_page_logic.page_albumlists_options_Sort_key[0].order.replace('end', '') : '',
                                page_lists_scrollindex: store_router_history_data_of_album.router_history_model_of_Album_scroller_value,
                            };
                            store_router_history_data_of_album.add_router_history_of_Album(routerDate);
                        }// 添加新记录
                        //////
                    } else {
                        if (store_router_history_data_of_album.router_select_history_date_of_Album) {
                            store_router_data_info.router.push('album')
                            store_router_data_info.router_select_model_album = true;
                            store_view_album_page_logic.page_albumlists_keyword = store_router_history_data_of_album.router_select_history_date_of_Album.page_lists_keyword;
                            store_view_album_page_logic.page_albumlists_selected = store_router_history_data_of_album.router_select_history_date_of_Album.page_lists_selected;
                            store_view_album_page_logic.page_albumlists_options_Sort_key = [
                                {
                                    columnKey: store_router_history_data_of_album.router_select_history_date_of_Album.columnKey,
                                    order: store_router_history_data_of_album.router_select_history_date_of_Album.order
                                }
                            ];
                            store_router_history_data_of_album.router_history_model_of_Album_scroller_value = store_router_history_data_of_album.router_select_history_date_of_Album.page_lists_scrollindex;
                            stmt_album = db.prepare(store_router_history_data_of_album.router_select_history_date_of_Album.stmt_string);
                        }
                        store_router_history_data_of_album.router_history_model_of_Album = 0;
                    }
                    store_view_album_page_info.album_Files_temporary = []
                    let rows = stmt_album.all();
                    rows.forEach((row: Album) => {
                        if (row.medium_image_url == null || row.medium_image_url == undefined || row.medium_image_url.length == 0) {
                            if(row.embed_art_path) {
                                const fileName = row.embed_art_path.split(/[\\/]/).pop(); // 兼容 Windows 和 Unix 路径分隔符
                                const newFileName = fileName.replace(/\.(mp3|flac)$/i, '.jpg');
                                row.medium_image_url = `${store_app_configs_info.driveTempPath}/${encodeURIComponent(newFileName)}`;
                            }else{
                                row.medium_image_url = error_album
                            }
                        }
                        const fileNameMatch = row.embed_art_path.match(/[^\\\/]+$/);
                        const fileNameWithExtension = fileNameMatch ? fileNameMatch[0] : null;
                        const fileNameWithoutExtension = fileNameWithExtension ? fileNameWithExtension.replace(/\.[^.]+$/, '') : null;
                        const fileNameWithoutPrefix = fileNameWithoutExtension ? fileNameWithoutExtension.replace(/.*?-\s*/, '') : null;
                        if (fileNameWithoutPrefix !== null) {
                            row.title = fileNameWithoutPrefix;
                        }
                        row.album_title = row.title + "<br>" + row.artist;
                        row.updated_time = row.updated_at ? moment(row.updated_at, moment.ISO_8601).format('YYYY-MM-DD') : '';
                        row.created_time = row.created_at ? moment(row.created_at, moment.ISO_8601).format('YYYY-MM-DD') : '';
                        store_view_album_page_info.album_Files_temporary.push(row);
                    });
                    rows.length = 0
                    moment = null;
                    ////// find favorite for album_Files_temporary
                    const stmt_album_Annotation_Starred_Items = db.prepare(`
                        SELECT item_id
                        FROM ${store_server_user_model.annotation}
                        WHERE starred = 1
                          AND item_type = 'album'
                    `);
                    const annotations = stmt_album_Annotation_Starred_Items.all();
                    for (let i = 0; i < store_view_album_page_info.album_Files_temporary.length; i++) {
                        store_view_album_page_info.album_Files_temporary[i].favorite = !!annotations.some((annotation: {
                            item_id: string
                        }) => annotation.item_id === store_view_album_page_info.album_Files_temporary[i].id);
                    }
                    ////// find rating for album_Files_temporary
                    const stmt_album_Annotation_Rating_Items = db.prepare(`
                        SELECT item_id, rating
                        FROM ${store_server_user_model.annotation}
                        WHERE rating > 0
                          AND item_type = 'album'
                    `);
                    const annotations_rating = stmt_album_Annotation_Rating_Items.all();
                    for (let i = 0; i < store_view_album_page_info.album_Files_temporary.length; i++) {
                        const albumFile = store_view_album_page_info.album_Files_temporary[i];
                        const matchingAnnotation = annotations_rating.find((annotation: {
                            item_id: string,
                            rating: number
                        }) => annotation.item_id === albumFile.id);
                        if (matchingAnnotation)
                            albumFile.rating = matchingAnnotation.rating;
                        else
                            albumFile.rating = 0;
                    }
                    ////// filter selected_list for album_Files_temporary
                    let order_play_date: any[] = [];
                    if (store_view_album_page_logic.page_albumlists_selected === 'album_list_recently') {
                        order_play_date = db.prepare(`
                            SELECT item_id
                            FROM ${store_server_user_model.annotation}
                            WHERE item_type = 'album'
                              AND play_count > 0
                            ORDER BY play_date DESC
                        `).all().map((annotation: any) => annotation.item_id);
                    }
                    store_view_album_page_info.album_Files_temporary = store_view_album_page_info.album_Files_temporary.filter((item: any) => {
                        if (store_view_album_page_logic.page_albumlists_selected === 'album_list_all') {
                            return true;
                        } else if (store_view_album_page_logic.page_albumlists_selected === 'album_list_love') {
                            return annotations.some((annotation: {
                                item_id: string
                            }) => annotation.item_id === item.id);
                        } else if (store_view_album_page_logic.page_albumlists_selected === 'album_list_recently') {
                            return order_play_date.includes(item.id);
                        } else if (store_view_album_page_logic.page_albumlists_selected === 'album_list_all_PlayList') {
                            return true;
                        }
                    });
                    if (store_view_album_page_logic.page_albumlists_selected === 'album_list_recently') {
                        let new_sort: Album[] = store_view_album_page_info.album_Files_temporary.slice();
                        store_view_album_page_info.album_Files_temporary = [];
                        order_play_date.forEach((id) => {
                            const index = new_sort.findIndex(item => item.id === id);
                            if (index !== -1) {
                                store_view_album_page_info.album_Files_temporary.push(new_sort[index]);
                                new_sort.splice(index, 1);
                            }
                        });
                    }
                    store_view_album_page_info.album_Files_temporary.forEach((item: any, index: number) => {
                        item.absoluteIndex = index + 1;
                    });
                } catch (err: any) {
                    console.error(err);
                } finally {
                    db.close();
                    console.log('db.close().......');
                    db = null;
                }
            }
            else if (store_server_user_model.model_server_type_of_web) {
                await this.fetchData_Album_of_server_web_start()
            }
        } else {
            // other
        }
    },
    async fetchData_This_Album_MediaList(album_id:any){
        store_player_appearance.player_mode_of_medialist_from_external_import = true;

        store_view_media_page_logic.page_songlists_keywordFilter = `WHERE album_id = '${album_id}'`
        store_view_media_page_logic.page_songlists_selected = 'song_list_all'
        store_view_media_page_info.media_Files_temporary = [];

        store_router_data_info.find_music_model = true;
        store_router_data_info.find_album_model = false;
        store_router_data_info.find_artist_model = false;
        await store_view_media_page_fetchData.fetchData_Media()
        store_router_data_info.find_music_model = false;

        store_playlist_list_fetchData.fetchData_PlayList()

        store_router_data_info.router_select_model_album = true

        if(store_playlist_list_info.playlist_MediaFiles_temporary.length > 0){
            store_player_appearance.player_mode_of_lock_playlist = false
            const media_file = store_playlist_list_info.playlist_MediaFiles_temporary[0]
            store_player_audio_info.this_audio_play_id = media_file.play_id
            store_player_audio_info.this_audio_file_path = media_file.path
            store_player_audio_info.this_audio_lyrics_string = media_file.lyrics
            store_player_audio_info.this_audio_file_medium_image_url = media_file.medium_image_url
            store_player_audio_info.this_audio_artist_name = media_file.artist
            store_player_audio_info.this_audio_song_name = media_file.title
            store_player_audio_info.this_audio_album_id = media_file.album_id
            store_player_audio_info.this_audio_album_favorite = media_file.favorite
            store_player_audio_info.this_audio_album_name = media_file.album
            store_player_audio_info.this_audio_Index_of_absolute_positioning_in_list = media_file.absoluteIndex
            ///
            store_player_audio_info.this_audio_song_id = media_file.id
            store_player_audio_info.this_audio_song_rating = media_file.rating
            store_player_audio_info.this_audio_song_favorite = media_file.favorite
            //
            store_player_tag_modify.player_current_media_starred = media_file.favorite
            store_player_tag_modify.player_current_media_playCount = media_file.play_count
            store_player_tag_modify.player_current_media_playDate = media_file.play_date
            //

            store_playlist_list_logic.media_page_handleItemDbClick = false
        }
    },
    removeCondition(filter, condition) {
        if (filter.indexOf(`WHERE ${condition}`) >= 0) {
            filter = filter.substring(0, filter.indexOf(`WHERE ${condition}`)).trim();
            if (filter.endsWith('AND')) {
                filter = filter.substring(0, filter.lastIndexOf('AND')).trim();
            }
        }
        if (filter.indexOf(`AND ${condition}`) >= 0) {
            filter = filter.substring(0, filter.indexOf(`AND ${condition}`)).trim();
            if (filter.endsWith('AND')) {
                filter = filter.substring(0, filter.lastIndexOf('AND')).trim();
            }
        }
        return filter;
    },
    addCondition(filter, condition) {
        if (filter.length === 0) {
            return `WHERE ${condition}`;
        } else {
            return `${filter} AND ${condition}`;
        }
    },

    _start: 0,
    _end: 100,
    _artist_id: '',
    async fetchData_Album_of_server_web_start(){
        store_view_album_page_info.album_Files_temporary = [];
        this._start = 0;
        this._end = 100;
        await this.fetchData_Album_of_server_web()

        if(store_player_appearance.player_mode_of_medialist_from_external_import) {
            store_view_media_page_fetchData._album_id = ''
            store_view_media_page_fetchData._artist_id = ''
            store_view_album_page_fetchData._artist_id = ''
        }
    },
    async fetchData_Album_of_server_web_end(){
        this._start += 100;
        this._end += 100;
        await this.fetchData_Album_of_server_web()
    },
    async fetchData_Album_of_server_web(){
        const _search = store_view_album_page_logic.page_albumlists_keyword;
        const selected = store_view_album_page_logic.page_albumlists_selected;
        ///
        let _sort = store_view_album_page_logic.page_albumlists_options_Sort_key.length > 0 && store_view_album_page_logic.page_albumlists_options_Sort_key[0].order !== 'default' ?
            store_view_album_page_logic.page_albumlists_options_Sort_key[0].columnKey : 'id';
        let _order = store_view_album_page_logic.page_albumlists_options_Sort_key.length > 0 && store_view_album_page_logic.page_albumlists_options_Sort_key[0].order !== 'default' ?
            store_view_album_page_logic.page_albumlists_options_Sort_key[0].order.replace('end', '') : 'ASC';
        ///
        let _starred = '';
        let playlist_id = '';
        if (selected === 'album_list_love') {
            _starred = true
        } else if (selected === 'album_list_recently') {
            _order = 'DESC'
            _sort = 'playDate'
        } else if (selected != 'album_list_all') {
            playlist_id = selected
        }
        let get_Navidrome_Temp_Data_To_LocalSqlite = new Get_Navidrome_Temp_Data_To_LocalSqlite()
        await get_Navidrome_Temp_Data_To_LocalSqlite.get_album_list(
            store_server_users.server_config_of_current_user_of_sqlite?.url + '/rest',
            store_server_users.server_config_of_current_user_of_sqlite?.user_name,
            store_server_user_model.token,
            store_server_user_model.salt,
            String(this._end),_order,_sort,String(this._start),
            _search,_starred,
            this._artist_id
        )
    }
});