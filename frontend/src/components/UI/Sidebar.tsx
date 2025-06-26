import { AllContentIcon } from "../../icons/AllContentIcon"
import { AppLogo } from "../../icons/AppLogo"
import { InstaIcon } from "../../icons/InstaIcon"
import { LinkIcon } from "../../icons/LinkIcon"
import { MusicIcon } from "../../icons/MusicIcon"
import { NotesIcon } from "../../icons/NotesIcon"
import { TwitterIcon } from "../../icons/TwitterIcon"
import { YoutubeIcon } from "../../icons/YoutubeIcon"
export function Sidebar({ specificContent }: { specificContent: (title: string) => void }) {
    return <div className="h-screen w-60 bg-white border-r-2 fixed left-0 top-0 shadow-lg">
        <div className="flex justify-center gap-4 p-4">
            <AppLogo size="lg"/>
            <div className="text-2xl font-semibold">Pure Note</div>
        </div>
        
        <div className="flex flex-col">
            <Option icon={<AllContentIcon size="md"/>} title={"All Content"} onClick={specificContent}/>
            <Option icon={<NotesIcon size="md"/>} title={"Notes"} onClick={specificContent}/>
            <Option icon={<TwitterIcon size="md"/>} title={"Twitter"} onClick={specificContent}/>
            <Option icon={<InstaIcon size="md"/>} title={"Instagram"} onClick={specificContent}/>
            <Option icon={<YoutubeIcon size="md"/>} title={"Youtube"} onClick={specificContent}/>
            <Option icon={<MusicIcon size="md"/>} title={"Music"} onClick={specificContent}/>
            <Option icon={<LinkIcon size="md"/>} title={"Link"} onClick={specificContent}/>
        </div>
    </div>
}

function Option({icon, title, onClick}){
    return <div className="flex items-center pl-4 py-2 gap-3 cursor-pointer hover:bg-[#faf7fe] mx-5 rounded-md
    transition-all duration-200" onClick={() => {onClick(title)}}>{icon} {title}</div>
}