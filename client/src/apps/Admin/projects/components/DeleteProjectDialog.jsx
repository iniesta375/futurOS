import Modal from "../../ui/Modal";

import { toast } from "react-toastify";

import { deleteProject } from "../../../../services/projectService";

export default function DeleteProjectDialog({

    open,

    close,

    project,

    refresh,

}){

    async function remove(){

        try{

            await deleteProject(project._id);

            refresh();

            close();

        }

        catch(err){

            toast.error(err.message);

        }

    }

    return(

        <Modal

            open={open}

            title="Delete Project"

            onClose={close}

        >

            <p className="mb-8">

                Delete

                <strong>

                    {" "}

                    {project?.title}

                </strong>

                ?

            </p>

            <div className="flex justify-end gap-4">

                <button

                    onClick={close}

                    className="glass-hover rounded-xl px-5 py-3"

                >

                    Cancel

                </button>

                <button

                    onClick={remove}

                    className="rounded-xl bg-red-500 px-5 py-3"

                >

                    Delete

                </button>

            </div>

        </Modal>

    )

}