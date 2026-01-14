import React, { useContext } from "react";
import { Rating } from "react-simple-star-rating";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { rateRecipe } from "../slices/recipeSlice";
import UserContext from "../contexts/userContext";

function Rate({ recipe, userRating }) {
    const dispatch = useDispatch();
    const { user } = useContext(UserContext);

    if (user && user._id === recipe?.createdBy) return null;

    const handleRating = async (newRating) => {
        try {
            if (!user) {
                toast.error("Please login to rate recipes");
                return;
            }
            await dispatch(rateRecipe({ id: recipe._id, value: newRating })).unwrap();
            toast.success("Rating submitted successfully!");
        } catch (error) {
            toast.error(error || "Failed to submit rating");
        }
    };

    return (
        <div className="flex flex-col gap-1 items-center bg-gray-50 p-3 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Rate this recipe</h3>
            <Rating
                onClick={handleRating}
                initialValue={userRating || 0}
                size={25}
                fillColor="#facc15"
                SVGclassName="inline-block"
                transition
                allowFraction={false}
            />
            {userRating > 0 && (
                <p className="text-[10px] text-gray-400 font-medium italic">
                    You rated this {userRating} stars
                </p>
            )}
        </div>
    );
}

export default Rate;
