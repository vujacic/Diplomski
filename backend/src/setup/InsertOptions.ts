import {OptionsService} from '../data/OptionsService'
import {Db} from "../data/Db";
import {OptionDto} from "../data/Dto/OptionDto";
const service = new OptionsService();


async function insertDefaultOptions(){

    const niz: OptionDto[] = [];
    niz.push({_key: "siteurl", value: "http://localhost:3002"});
    niz.push({_key: "home", value: "http://localhost:3002"});
    niz.push({_key: "sitename", value: "Diplomski"});
    niz.push({_key: "sitedesc", value: "Jeste ovo je CMS"});
    niz.push({_key: "admin_email", value: "lgsony95@hotmail.com"});
    niz.push({_key: "users_can_register", value: false});
    niz.push({_key: "default_category", value: "1"});
    niz.push({_key: "require_name_email", value: true});
    niz.push({_key: "default_comment_status", value: "open"});
    niz.push({_key: "posts_per_page", value: 10});
    niz.push({_key: "permalink_structure", value: "postname"});
    niz.push({_key: "rewrite_rules", value: ""});
    niz.push({_key: "template", value: "francesca"});
    niz.push({_key: "stylesheet", value: "francesca"});
    niz.push({_key: "upload_path", value: ""});
    niz.push({_key: "show_on_front", value: "posts"});
    niz.push({_key: "thumbnail_size_w", value: "150"});
    niz.push({_key: "thumbnail_size_h", value: "150"});
    niz.push({_key: "thumbnail_crop", value: "1"});
    niz.push({_key: "medium_size_w", value: "300"});
    niz.push({_key: "medium_size_h", value: "300"});
    niz.push({_key: "large_size_w", value: "1024"});
    niz.push({_key: "large_size_h", value: "1024"});
    niz.push({_key: "image_default_link_type", value: "none"});
    niz.push({_key: "image_default_size", value: ""});
    niz.push({_key: "image_default_align", value: ""});
    niz.push({_key: "thread_comments", value: true});
    niz.push({_key: "thread_comments_depth", value: "5"});
    niz.push({_key: "page_comments", value: "0"});
    niz.push({_key: "comments_per_page", value: "50"});
    niz.push({_key: "comment_order", value: "asc"});
    niz.push({_key: "site_icon", value: "0"});
    niz.push({_key: "current_theme", value: "francesca"});
    niz.push({_key: "theme_mods_francesca", value: {}});
    niz.push({_key: "nav_menu_options", value: {}});




    const trx = await Db.beginTransaction(service.option);

    const keys = await service.deleteAll();
    // console.log(await keys.all());

    for await (const x of niz){
        await trx.step(() => service.create(x))
    }

    await trx.commit();
}

insertDefaultOptions()
    .then(() => {
        console.log("options added");
    })
    .catch( e => {

        console.log(e.message);
    })

