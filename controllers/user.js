const User = require('../models/user.js')
const Category = require('../models/category.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const slugify = require('slugify');
const Optional = require('../models/optional.js');
const Coupon = require('../models/coupon.js');
const Delivery = require('../models/delivery.js')
const Time = require('../models/time.js')
const Product = require('../models/product.js')
const BlogCategory = require('../models/blogCategory.js')
const Blog = require('../models/blog.js')
const Customer = require('../models/customer.js')
const Address = require('../models/address.js')
const Wishlist = require('../models/wishlist.js')
const Cart = require('../models/cart.js');
const Stripe = require('stripe');
const Order = require('../models/order.js');



exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;
        const validUser = await User.findOne({ email: email });
        if (!validUser) {
            return res.status(400).json({
                message: "Email is not found"
            })
        }
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword) {
            return res.status(400).json({
                message: "Incorrect Password"
            })
        }

        const token = jwt.sign({ id: validUser._id }, process.env.SECRET_KEY)

        return res.status(200).json({
            id: validUser._id,
            fullName: validUser.fullName,
            email: validUser.email,
            token: token,
            avatar: validUser.avatar,
            createdAt: validUser.createdAt
        })


    } catch (error) {

        return res.status(500).json({
            "message": "Internal server error"
        })

    }

}

exports.logout = async (req, res) => {
    try {

        let tmp = req.header("Authorization");
        tmp = null
        const token = tmp;
        return res.status(200).json({
            "message": "User has been logged out"
        })

    } catch (error) {
        res.status(500).json(error)

    }

}

exports.passwordChange = async (req, res) => {
    try {

        const userId = req.user.id;
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (newPassword.length < 7) {
            return res.status(400).json({
                message: 'Password length must be 8 or above character'
            })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: 'Confirm password not matched'
            })

        }



        const user = await User.findById(userId);

        const checkPassword = bcrypt.compareSync(oldPassword, user.password);

        if (!checkPassword) {
            return res.status(400).json({
                message: 'Your old password not matched'
            })
        }



        let cryptedPassword;
        if (newPassword) {
            cryptedPassword = await bcrypt.hash(newPassword, 12)
        }

        const updateUser = await User.findByIdAndUpdate(userId, { password: cryptedPassword }, { new: true })



        if (!updateUser) {
            return res.status(400).json({ message: 'User not found' });
        }

        return res.status(200).json({
            message: 'Password Updated Successfully'
        })

    } catch (error) {
        console.log(error)
    }
}

exports.profileUpdate = async (req, res) => {
    try {

        let tmp = req.header("Authorization");
        const token = tmp ? tmp.slice(7, tmp.length) : "";
        const userId = req.user.id;
        const { fullName, email, avatar } = req.body;



        const updateUser = await User.findByIdAndUpdate(userId, { fullName, email, avatar }, { new: true })


        if (!updateUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            id: updateUser._id,
            email: updateUser.email,
            fullName: updateUser.fullName,
            avatar: updateUser.avatar,
            token: token,
            message: 'User information updated',
            createdAt: updateUser.createdAt
        })


    } catch (error) {
        return res.status(500).json(error)
    }
}

exports.addCategory = async (req, res) => {
    try {

        const { name, avatar, status } = req.body

        const string = req.body.name;
        const slug = slugify(string);

        const customSlug = slugify(string, {
            replacement: '-',  // replace spaces with '-'
            lower: true        // convert to lowercase
        });


        const category = await new Category({

            name,
            avatar,
            status,
            slug: customSlug

        }).save();

        res.status(200).json(category)


    } catch (error) {
        console.log(error)
    }
}

exports.allCategory = async (req, res) => {

    try {

        const category = await Category.find();
        return res.status(200).json(category)

    } catch (error) {
        return res.status(500).json(error)
    }

}

exports.editCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;


        const data = await Category.findById(categoryId);
        return res.status(200).json(data)



    } catch (error) {
        return (error)
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { name, avatar, status, slug } = req.body;

        const updateData = await Category.findByIdAndUpdate(categoryId, { name, avatar, status, slug }, { new: true })

        if (!updateData) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json(updateData)


    } catch (error) {
        console.log(error)
    }
}

exports.deleteCategory = async (req, res) => {
    try {

        const categoryId = req.params.id;


        const data = await Category.findOneAndDelete({ _id: categoryId })

        if (!data) {
            return res.status(401).json({
                message: 'No data found'
            })
        }

        return res.status(200).json({
            message: 'Data deleted successfully'
        })

    } catch (error) {
        return (error)
    }
}

exports.categoryStatus = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const data = await Category.findById(categoryId);

        let status = data.status;

        if (status === 'Active') {
            status = 'Inactive'
        } else {
            status = 'Active'
        }

        const updateData = await Category.findByIdAndUpdate(categoryId, { status: status }, { new: true })

        if (!updateData) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json(updateData)


    } catch (error) {
        console.log(error)
    }
}


exports.addOptionalItem = async (req, res) => {
    try {

        const { name, price, status } = req.body

        const optional = await new Optional({

            name,
            price,
            status,

        }).save();

        res.status(200).json(optional)


    } catch (error) {
        console.log(error)
    }
}

exports.allOptional = async (req, res) => {

    try {

        const optional = await Optional.find();
        return res.status(200).json(optional)

    } catch (error) {
        return res.status(500).json(error)
    }

}

exports.editOptional = async (req, res) => {
    try {
        const optionId = req.params.id;
        const data = await Optional.findById(optionId);
        return res.status(200).json(data)

    } catch (error) {
        return (error)
    }
}


exports.updateOptional = async (req, res) => {
    try {
        const optionId = req.params.id;
        const { name, price, status } = req.body;

        const updateData = await Optional.findByIdAndUpdate(optionId, { name, price, status }, { new: true })

        if (!updateData) {
            return res.status(404).json({ message: 'Data not found' });
        }

        return res.status(200).json(updateData)


    } catch (error) {
        console.log(error)
    }
}


exports.optionalStatus = async (req, res) => {
    try {
        const optionId = req.params.id;

        const data = await Optional.findById({ _id: optionId });

        let status = data.status;

        if (status === 'Active') {
            status = 'Inactive'
        } else {
            status = 'Active'
        }

        const updateData = await Optional.findByIdAndUpdate(optionId, { status: status }, { new: true })

        if (!updateData) {
            return res.status(404).json({ message: 'Data not found' });
        }

        return res.status(200).json(updateData)


    } catch (error) {
        console.log(error)
    }
}

exports.deleteOptional = async (req, res) => {
    try {

        const optionId = req.params.id;


        const data = await Optional.findOneAndDelete({ _id: optionId })

        if (!data) {
            return res.status(401).json({
                message: 'No data found'
            })
        }

        return res.status(200).json({
            message: 'Data deleted successfully'
        })

    } catch (error) {
        return (error)
    }
}


exports.addCoupon = async (req, res) => {
    try {

        const { name, code, expireDate, discount, status } = req.body

        const coupon = await new Coupon({

            name,
            code,
            expireDate,
            discount,
            status

        }).save();

        res.status(200).json(coupon)


    } catch (error) {
        console.log(error)
    }
}



exports.allCoupon = async (req, res) => {

    try {

        const coupon = await Coupon.find();
        return res.status(200).json(coupon)

    } catch (error) {
        return res.status(500).json(error)
    }

}

exports.editCoupon = async (req, res) => {
    try {
        const couponId = req.params.id;
        const data = await Coupon.findById(couponId);
        return res.status(200).json(data)

    } catch (error) {
        return (error)
    }
}


exports.updateCoupon = async (req, res) => {
    try {
        const couponId = req.params.id;
        const { name, code, status, discount, expireDate } = req.body;

        const updateData = await Coupon.findByIdAndUpdate(couponId, { name, code, status, discount, expireDate }, { new: true })

        if (!updateData) {
            return res.status(404).json({ message: 'Data not found' });
        }

        return res.status(200).json(updateData)


    } catch (error) {
        console.log(error)
    }
}

exports.couponStatus = async (req, res) => {
    try {
        const couponId = req.params.id;

        const data = await Coupon.findById({ _id: couponId });

        let status = data.status;

        if (status === 'Active') {
            status = 'Inactive'
        } else {
            status = 'Active'
        }

        const updateData = await Coupon.findByIdAndUpdate(couponId, { status: status }, { new: true })

        if (!updateData) {
            return res.status(404).json({ message: 'Data not found' });
        }

        return res.status(200).json(updateData)


    } catch (error) {
        console.log(error)
    }
}


exports.deleteCoupon = async (req, res) => {
    try {

        const couponId = req.params.id;


        const data = await Coupon.findOneAndDelete({ _id: couponId })

        if (!data) {
            return res.status(401).json({
                message: 'No data found'
            })
        }

        return res.status(200).json({
            message: 'Data deleted successfully'
        })

    } catch (error) {
        return (error)
    }
}


exports.addDelivery = async (req, res) => {
    try {

        const { name, minTime, maxTime, dfee, status } = req.body

        const delivery = await new Delivery({

            name,
            minTime,
            maxTime,
            dfee,
            status

        }).save();

        res.status(200).json(delivery)


    } catch (error) {
        console.log(error)
    }
}



exports.allDelivery = async (req, res) => {

    try {

        const delivery = await Delivery.find();
        return res.status(200).json(delivery)

    } catch (error) {
        return res.status(500).json(error)
    }

}

exports.editDelivery = async (req, res) => {
    try {
        const deliveryId = req.params.id;
        const data = await Delivery.findById(deliveryId);
        return res.status(200).json(data)

    } catch (error) {
        return (error)
    }
}

exports.updateDelivery = async (req, res) => {
    try {
        const deliveryId = req.params.id;
        const { name, minTime, maxTime, dfee, status } = req.body;

        const updateData = await Delivery.findByIdAndUpdate(deliveryId, { name, minTime, maxTime, dfee, status }, { new: true })

        if (!updateData) {
            return res.status(404).json({ message: 'Data not found' });
        }

        return res.status(200).json(updateData)


    } catch (error) {
        console.log(error)
    }
}


exports.deliveryStatus = async (req, res) => {
    try {
        const deliveryId = req.params.id;

        const data = await Delivery.findById({ _id: deliveryId });

        let status = data.status;

        if (status === 'Active') {
            status = 'Inactive'
        } else {
            status = 'Active'
        }

        const updateData = await Delivery.findByIdAndUpdate(deliveryId, { status: status }, { new: true })

        if (!updateData) {
            return res.status(404).json({ message: 'Data not found' });
        }

        return res.status(200).json(updateData)


    } catch (error) {
        console.log(error)
    }
}

exports.deleteDelivery = async (req, res) => {
    try {

        const deliveryId = req.params.id;


        const data = await Delivery.findOneAndDelete({ _id: deliveryId })

        if (!data) {
            return res.status(401).json({
                message: 'No data found'
            })
        }

        return res.status(200).json({
            message: 'Data deleted successfully'
        })

    } catch (error) {
        return (error)
    }
}

exports.addTime = async (req, res) => {
    try {

        const { slot, status } = req.body

        const time = await new Time({

            slot,
            status

        }).save();

        res.status(200).json(time)


    } catch (error) {
        console.log(error)
    }
}


exports.allTime = async (req, res) => {

    try {

        const time = await Time.find();
        return res.status(200).json(time)

    } catch (error) {
        return res.status(500).json(error)
    }

}


exports.timeStatus = async (req, res) => {
    try {
        const timeId = req.params.id;

        const data = await Time.findById({ _id: timeId });

        let status = data.status;

        if (status === 'Active') {
            status = 'Inactive'
        } else {
            status = 'Active'
        }

        const updateData = await Time.findByIdAndUpdate(timeId, { status: status }, { new: true })

        if (!updateData) {
            return res.status(404).json({ message: 'Data not found' });
        }

        return res.status(200).json(updateData)


    } catch (error) {
        console.log(error)
    }
}


exports.editTime = async (req, res) => {
    try {
        const timeId = req.params.id;
        const data = await Time.findById(timeId);
        return res.status(200).json(data)

    } catch (error) {
        return (error)
    }
}


exports.updateTime = async (req, res) => {
    try {
        const timeId = req.params.id;
        const { slot } = req.body;

        const updateData = await Time.findByIdAndUpdate(timeId, { slot }, { new: true })

        if (!updateData) {
            return res.status(404).json({ message: 'Data not found' });
        }

        return res.status(200).json(updateData)


    } catch (error) {
        console.log(error)
    }
}

exports.deleteTime = async (req, res) => {
    try {

        const timeId = req.params.id;


        const data = await Time.findOneAndDelete({ _id: timeId })

        if (!data) {
            return res.status(401).json({
                message: 'No data found'
            })
        }

        return res.status(200).json({
            message: 'Data deleted successfully'
        })

    } catch (error) {
        return (error)
    }
}

exports.addProduct = async (req, res) => {
    try {

        const { productName, slug, category, status, price, offerPrice, vedioUrl, tdescription, bdescription, ldescription, populer, avatar, vavatar, optionalItem, multipleImage, productSize, specification } = req.body

        const generateRandomId = () => {
            return Math.floor(Math.random() * 1000000).toString();
        };

        const multipleImageWithIds = multipleImage.map((imageUrl) => ({
            id: generateRandomId(),
            link: imageUrl
        }));

        const optionData = optionalItem.map((item) => ({
            id: item
        }))



        const data = await new Product({

            productName,
            slug,
            category,
            status,
            price,
            offerPrice,
            vedioUrl,
            tdescription,
            bdescription,
            ldescription,
            populer,
            avatar,
            vavatar,
            optionalItem: optionData,
            multipleImage: multipleImageWithIds,
            productSize,
            specification

        }).save();

        res.status(200).json(data)


    } catch (error) {

        console.log(error)
        return res.status(500).json(error)
    }
}

exports.allProduct = async (req, res) => {

    try {

        const product = await Product.find({ status: 'Active' });
        return res.status(200).json(product)

    } catch (error) {
        return res.status(500).json(error)
    }

}

exports.editProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const data = await Product.findById(productId);
        return res.status(200).json(data)

    } catch (error) {
        return (error)
    }
}

exports.deleteProductImage = async (req, res) => {
    try {

        const { productId, imageId } = req.params;

        const data = await Product.findByIdAndUpdate(productId, {
            $pull: { 'multipleImage': { 'id': imageId } }
        });

        if (!data) {
            return res.status(404).json({
                message: 'No data found'
            });
        }

        return res.status(200).json({
            message: 'Image deleted successfully'
        });

    } catch (error) {
        console.log(error)

    }
}



exports.updateProductImage = async (req, res) => {
    try {
        const productId = req.params.id;
        const { multipleImage } = req.body;

        const generateRandomId = () => {
            return Math.floor(Math.random() * 1000000).toString();
        };

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Ensure product.multipleImage is an array
        const existingImages = Array.isArray(product.multipleImage) ? product.multipleImage : [];

        // Map existing images with their IDs
        const updatedImages = [
            ...existingImages,
            ...multipleImage.map(imageUrl => ({
                id: generateRandomId(),
                link: imageUrl
            }))
        ];

        // Update product with updated images
        const updateData = await Product.findByIdAndUpdate(productId, { multipleImage: updatedImages }, { new: true });



        return res.status(200).json(updateData);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { productName, slug, category, status, price, offerPrice, vedioUrl, tdescription, bdescription, ldescription, populer, avatar, vavatar, optionalItem, multipleImage, productSize, specification } = req.body

        const updateData = await Product.findByIdAndUpdate(productId, { productName, slug, category, status, price, offerPrice, vedioUrl, tdescription, bdescription, ldescription, populer, avatar, vavatar, optionalItem, multipleImage, productSize, specification }, { new: true })

        if (!updateData) {
            return res.status(404).json({ message: 'Product not Found' });
        }

        return res.status(200).json(updateData)


    } catch (error) {
        console.log(error)
    }
}


exports.deleteProduct = async (req, res) => {
    try {

        const productId = req.params.id;


        const data = await Product.findOneAndDelete({ _id: productId })

        if (!data) {
            return res.status(401).json({
                message: 'No data found'
            })
        }

        return res.status(200).json({
            message: 'Data deleted successfully'
        })

    } catch (error) {
        return (error)
    }
}


exports.productStatus = async (req, res) => {
    try {
        const productId = req.params.id;

        const data = await Product.findById({ _id: productId });

        let status = data.status;

        if (status === 'Active') {
            status = 'Inactive'
        } else {
            status = 'Active'
        }

        const updateData = await Product.findByIdAndUpdate(productId, { status: status }, { new: true })

        if (!updateData) {
            return res.status(404).json({ message: 'Data not found' });
        }

        return res.status(200).json(updateData)


    } catch (error) {
        console.log(error)
    }
}


exports.addBlogCategory = async (req, res) => {
    try {

        const { name, status, slug } = req.body

        const data = await new BlogCategory({

            name,
            status,
            slug

        }).save();

        res.status(200).json(data)


    } catch (error) {
        console.log(error)
    }
}

exports.allBlogCategory = async (req, res) => {

    try {

        const data = await BlogCategory.find();
        return res.status(200).json(data)


    } catch (error) {
        return res.status(500).json(error)
    }

}


exports.editBlogCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const data = await BlogCategory.findById(categoryId);
        return res.status(200).json(data)

    } catch (error) {
        return (error)
    }
}


exports.updateBlogCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { name, status, slug } = req.body

        const updateData = await BlogCategory.findByIdAndUpdate(categoryId, { name, status, slug }, { new: true })

        if (!updateData) {
            return res.status(404).json({ message: 'Data not found' });
        }

        return res.status(200).json(updateData)


    } catch (error) {
        console.log(error)
    }
}


exports.blogCategoryStatus = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const data = await BlogCategory.findById({ _id: categoryId });

        let status = data.status;

        if (status === 'Active') {
            status = 'Inactive'
        } else {
            status = 'Active'
        }

        const updateData = await BlogCategory.findByIdAndUpdate(categoryId, { status: status }, { new: true })

        if (!updateData) {
            return res.status(404).json({ message: 'Data not found' });
        }

        return res.status(200).json(updateData)


    } catch (error) {
        console.log(error)
    }
}



exports.deleteBlogcategory = async (req, res) => {
    try {

        const categoryId = req.params.id;


        const data = await BlogCategory.findOneAndDelete({ _id: categoryId })

        if (!data) {
            return res.status(401).json({
                message: 'No data found'
            })
        }

        return res.status(200).json({
            message: 'Data deleted successfully'
        })

    } catch (error) {
        return (error)
    }
}


exports.addBlog = async (req, res) => {
    try {

        const { title, status, slug, avatar, category, description, editorData } = req.body

        const data = await new Blog({

            title,
            status,
            slug,
            avatar,
            category,
            description,
            editorData

        }).save();

        res.status(200).json(data)


    } catch (error) {
        return (error)
        console.log(error)
    }
}


exports.allBlog = async (req, res) => {

    try {

        const data = await Blog.find();
        return res.status(200).json(data)


    } catch (error) {
        return res.status(500).json(error)
    }

}

exports.editBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const data = await Blog.findById(blogId);
        return res.status(200).json(data)

    } catch (error) {
        return (error)
    }
}


exports.updateBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const { title, status, slug, avatar, description, category, editorData } = req.body


        const updateData = await Blog.findByIdAndUpdate(blogId, { title, status, slug, avatar, description, category, editorData }, { new: true })

        if (!updateData) {
            return res.status(404).json({ message: 'Data not found' });
        }

        return res.status(200).json(updateData)


    } catch (error) {
        console.log(error)
        return (error)
    }
}

exports.blogStatus = async (req, res) => {
    try {
        const blogId = req.params.id;

        const data = await Blog.findById({ _id: blogId });

        let status = data.status;

        if (status === 'Active') {
            status = 'Inactive'
        } else {
            status = 'Active'
        }

        const updateData = await Blog.findByIdAndUpdate(blogId, { status: status }, { new: true })

        if (!updateData) {
            return res.status(404).json({ message: 'Data not found' });
        }

        return res.status(200).json(updateData)


    } catch (error) {
        console.log(error)
    }
}


exports.deleteBlog = async (req, res) => {
    try {

        const blogId = req.params.id;


        const data = await Blog.findOneAndDelete({ _id: blogId })

        if (!data) {
            return res.status(401).json({
                message: 'No data found'
            })
        }

        return res.status(200).json({
            message: 'Data deleted successfully'
        })

    } catch (error) {
        return (error)
    }
}


exports.specificMenu = async (req, res) => {
    try {
        const title = req.params.title;
        const data = await Product.findOne({ slug: title }).populate('optionalItem');


        if (!data) {
            return res.status(404).json('No Data Found')
        }
        return res.status(200).json(data)

    } catch (error) {
        return (error)
    }
}


exports.customerRegister = async (req, res) => {
    try {

        const { name, email, password, avatar } = req.body

        const cryptedPassword = await bcrypt.hash(password, 12)

        const existEmail = await Customer.findOne({ email })

        if (existEmail) {
            return res.status(400).json({
                "message": "This email are already used"
            })
        }

        const passLength = password.length > 6;

        if (!passLength) {
            return res.status(400).json({
                "message": "Password at lest 6 character or number"
            })
        }

        const data = await new Customer({

            name,
            email,
            password: cryptedPassword,
            avatar

        }).save();

        res.status(200).json(data)


    } catch (error) {
        return (error)
        console.log(error)
    }
}


exports.customerLogin = async (req, res) => {

    try {

        const { email, password } = req.body;
        const validUser = await Customer.findOne({ email: email });
        if (!validUser) {
            return res.status(400).json({
                message: "Email is not found"
            })
        }
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword) {
            return res.status(400).json({
                message: "Incorrect Password"
            })
        }

        const token = jwt.sign({ id: validUser._id }, process.env.SECRET_KEY)

        return res.status(200).json({
            id: validUser._id,
            name: validUser.name,
            email: validUser.email,
            token: token,
            phone: validUser.phone,
            address: validUser.address,
            avatar: validUser.avatar,
            createdAt: validUser.createdAt
        })


    } catch (error) {

        return res.status(500).json({
            "message": "Internal server error"
        })
        console.log(error)

    }

}

exports.customerLogout = async (req, res) => {
    try {

        let tmp = req.header("Authorization");
        tmp = null
        const token = tmp;
        return res.status(200).json({
            "message": "User has been logged out"
        })

    } catch (error) {
        res.status(500).json(error)

    }

}


exports.customerAddress = async (req, res) => {
    try {

        const { customer, darea, fname, lname, phone, email, address, selectedOption } = req.body

        const data = await new Address({

            customer, darea, fname, lname, phone, email, address, selectedOption

        }).save();

        res.status(200).json(data)


    } catch (error) {
        return (error)
        console.log(error)
    }
}


exports.allAddress = async (req, res) => {

    try {

        const customerId = req.params.id;

        const data = await Address.find({ customer: customerId }).populate('darea');

        //const data = await Product.findOne({slug: title}).populate('optionalItem');
        return res.status(200).json(data)


    } catch (error) {
        return res.status(500).json(error)
        console.log(error)
    }

}


exports.deleteAddress = async (req, res) => {
    try {

        const addressId = req.params.id;


        const data = await Address.findOneAndDelete({ _id: addressId })

        if (!data) {
            return res.status(401).json({
                message: 'No data found'
            })
        }

        return res.status(200).json({
            message: 'Data deleted successfully'
        })

    } catch (error) {
        return (error)
    }
}

exports.editAddress = async (req, res) => {
    try {
        const addressId = req.params.id;
        const data = await Address.findById(addressId);
        return res.status(200).json(data)

    } catch (error) {
        return (error)
    }
}

exports.updateUserAddress = async (req, res) => {
    try {
        const addressId = req.params.id;
        const { customer, darea, fname, lname, phone, email, address, selectedOption } = req.body


        const updateData = await Address.findByIdAndUpdate(addressId, { customer, darea, fname, lname, phone, email, address, selectedOption }, { new: true })

        if (!updateData) {
            return res.status(404).json({ message: 'Data not found' });
        }

        return res.status(200).json(updateData)


    } catch (error) {
        console.log(error)
        return (error)
    }
}


exports.updateCustomerProfile = async (req, res) => {
    try {
        const customerId = req.params.id;
        let tmp = req.header("Authorization");
        const token = tmp ? tmp.slice(7, tmp.length) : "";
        const { name, email, phone, avatar, address } = req.body


        const updateData = await Customer.findByIdAndUpdate(customerId, { name, email, phone, avatar, address }, { new: true })

        if (!updateData) {
            return res.status(404).json({ message: 'Data not found' });
        }

        return res.status(200).json({
            id: updateData._id,
            token: token,
            name: updateData.name,
            avatar: updateData.avatar,
            email: updateData.email,
            phone: updateData.phone,
            address: updateData.address
        })


    } catch (error) {
        console.log(error)
        return (error)
    }
}



exports.customerPasswordChange = async (req, res) => {
    try {

        const userId = req.user.id;
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (newPassword.length < 7) {
            return res.status(400).json({
                message: 'Password length must be 8 or above character'
            })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: 'Confirm password not matched'
            })

        }



        const user = await Customer.findById(userId);

        const checkPassword = bcrypt.compareSync(oldPassword, user.password);

        if (!checkPassword) {
            return res.status(400).json({
                message: 'Your current password not matched'
            })
        }



        let cryptedPassword;
        if (newPassword) {
            cryptedPassword = await bcrypt.hash(newPassword, 12)
        }

        const updateUser = await Customer.findByIdAndUpdate(userId, { password: cryptedPassword }, { new: true })



        if (!updateUser) {
            return res.status(400).json({ message: 'User not found' });
        }

        return res.status(200).json({
            message: 'Password Updated Successfully'
        })

    } catch (error) {
        console.log(error)
    }
}


exports.wishlist = async (req, res) => {
    try {

        const productId = req.params.productId;
        const customerId = req.params.customerId;

        const product = await Wishlist.findOne({ productId: productId });

        if (!product) {

            const data = await new Wishlist({
                productId, customerId
            }).save();

            const wishlistData = await Wishlist.find();

            res.status(200).json(wishlistData)

        }



        if (product) {
            return res.status(400).json({
                message: 'Product has already save your wishlist'
            })
        }


    } catch (error) {
        return (error)
        console.log(error)
    }
}


exports.allWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const data = await Wishlist.find({ customerId: userId }).populate('productId');
        return res.status(200).json(data)

    } catch (error) {
        return (error)
    }
}

exports.specificProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const data = await Product.findById(productId);

        return res.status(200).json(data)

    } catch (error) {
        return (error)
    }
}


exports.addCart = async (req, res) => {
    try {

        const { productId, productSize, optData, productQty, customerName } = req.body;

        const checkProduct = await Cart.findOne({ productId: productId })

        if (checkProduct) {
            return res.status(400).json({
                message: 'This product has already your cart'
            })
        }

        const productData = await Product.findById(productId);

        const productName = productData.productName;
        const avatar = productData.avatar;
        let productSizePrice = 0;
        let productSizeName = null;
        let productSizeId = null;

        const sizeData = productSize.map(size => ({ id: size }))

        //productSizePrice && Name

        sizeData.forEach(size => {
            productData.productSize.forEach(data => {
                if (size.id === data.id) {
                    productSizePrice = data.price;
                    productSizeName = data.size;
                    productSizeId = data.id
                }
            });
        });

        //optionalData


        let optionName = '';
        let optionPrice = 0;

        let totalOptionPrice = 0

        const optDataWithId = optData.map(option => ({ id: option }));

        let optionalData = [];

        // Use a for...of loop or map function with async/await to handle promises
        for (const opt of optDataWithId) {
            const option = await Optional.findById(opt.id);
            optionalData.push(option);
        }

        let totalOptional = 0;

        optionalData.forEach((optData) => {
            totalOptional += parseInt(optData.price)
        })



        const subTotal = parseInt(totalOptional) + parseInt(productSizePrice);

        const allOptionalData = await Optional.find({ status: 'Active' });


        const data = await new Cart({

            productId,
            productSize: productSize.map(size => ({ id: size })),
            optData: optData.map(option => ({ id: option })),
            productName,
            avatar,
            productSizePrice,
            productSizeName,
            optInfo: optionalData.map(info => ({ id: info._id, name: info.name, price: info.price, status: info.status })),
            subTotal: subTotal,
            allProductSize: productData.productSize.map(item => ({ id: item.id, size: item.size, price: item.price })),
            productSizeId,
            allOptionalData: allOptionalData.map(item => ({ id: item._id, name: item.name, price: item.price })),
            productQty,
            customerName


        }).save();




        return res.status(200).json(data);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.cartOptionalData = async (req, res) => {
    try {
        const optionalId = req.params.id.toString();

        const cartData = await Cart.find({ "optData.id": optionalId });


        if (cartData && cartData.length > 0) {
            // Remove the optData with the matching optionalId
            const updatedCart = await Cart.findOneAndUpdate(
                { "optData.id": optionalId },
                { $pull: { optData: { id: optionalId } } },
                { new: true }
            );



            const updatedCart2 = await Cart.findOneAndUpdate(
                { "optInfo.id": optionalId },
                { $pull: { optInfo: { id: optionalId } } },
                { new: true }
            );


            const cart = await Cart.find();
            return res.status(200).json(cart);
        } else {
            // Add the new optData with the matching optionalId
            const updatedCart = await Cart.findOneAndUpdate(
                {},
                { $push: { optData: { id: optionalId } } }, // Push the new optData
                { new: true }
            );

            const allOptionalData = await Optional.find();

            allOptionalData.forEach(async (item) => {
                // Check if the id of the current item matches optionalId
                if (item.id === optionalId) {
                    // If there is a match, update the Cart with the entire object from allOptionalData
                    const updatedInfoCart = await Cart.findOneAndUpdate(
                        {},
                        { $push: { optInfo: item } },
                        { new: true }
                    );
                    // You can return the updatedInfoCart or do any additional processing here

                }
            });


            const cart = await Cart.find();
            return res.status(200).json(cart);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.updateCart = async (req, res) => {
    try {
        const { productSize, cartId } = req.body

        const cartData = await Cart.findById(cartId);

        let productSizePrice = 0;
        let productSizeName = null;
        let productSizeId = null;


        cartData.allProductSize.forEach(data => {
            if (data.id === productSize) {
                productSizePrice = data.price;
                productSizeName = data.size;
                productSizeId = data.id
            }
        });

        let totalOptional = 0;

        cartData.optInfo.forEach((optData) => {
            totalOptional += parseInt(optData.price)
        })

        const subTotal = parseInt(totalOptional) + parseInt(productSizePrice);

        const updateUser = await Cart.findByIdAndUpdate(cartId, { productSizePrice: productSizePrice, productSizeName: productSizeName, productSizeId: productSizeId, subTotal: subTotal }, { new: true })

        const totalData = await Cart.find();

        res.status(200).json(totalData)


    } catch (error) {
        console.log(error)
    }
}



exports.cartPriceInc = async (req, res) => {
    try {

        const cartId = req.params.id

        const checkProduct = await Cart.findById(cartId)

        let productQty = checkProduct.productQty;
        productQty = productQty + 1

        if (!checkProduct) {
            return res.status(400).json({
                "message": 'No Product Found'
            })
        }


        const productSizePrice = checkProduct.productSizePrice;
        const subTotal = checkProduct.subTotal
        const updatePrice = parseInt(productSizePrice) + parseInt(subTotal)
        const updateData = await Cart.findByIdAndUpdate(cartId, { subTotal: updatePrice, productQty: productQty }, { new: true })


        const data = await Cart.find();

        return res.status(200).json(data);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


exports.cartPriceDec = async (req, res) => {
    try {

        const cartId = req.params.id

        const checkProduct = await Cart.findById(cartId)

        let productQty = checkProduct.productQty;

        if (productQty === 1) {
            return res.status(400).json({
                message: 'Product At Least One Item'
            })
        }

        productQty = productQty - 1


        if (!checkProduct) {
            return res.status(400).json({
                "message": 'No Product Found'
            })
        }


        const productSizePrice = checkProduct.productSizePrice;
        const subTotal = checkProduct.subTotal
        const updatePrice = parseInt(subTotal) - parseInt(productSizePrice)
        const updateData = await Cart.findByIdAndUpdate(cartId, { subTotal: updatePrice, productQty: productQty }, { new: true })


        const data = await Cart.find();

        return res.status(200).json(data);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

exports.allCart = async (req, res) => {
    try {

        const data = await Cart.find();

        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


exports.deleteCart = async (req, res) => {
    try {

        const cartId = req.params.id;


        const data = await Cart.findOneAndDelete({ productId: cartId })

        if (!data) {
            return res.status(401).json({
                message: 'No data found'
            })
        }

        const cartData = await Cart.find();

        return res.status(200).json(cartData)

    } catch (error) {
        return (error)
    }
}


exports.processOrder = async (req, res) => {
    try {

        const { address, cart, customer, grandTotal, subTotal, deliveryFee } = req.body

        const lineItems = Array.isArray(cart) ? cart.map(item => ({
            price_data: {
                currency: 'BDT',
                product_data: {
                    name: item.productName,
                    images: [item.avatar],
                },
                unit_amount: Math.round(item.subTotal * 100),
                // Stripe requires amount in cents
            },
            quantity: item.productQty, // Assuming each item is one unit
        })) : [];



        const stripe = new Stripe(process.env.STRIPE_SECRET);
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            success_url: `${process.env.CLIENT_SITE_URL}/payment-success`,
            cancel_url: `${req.protocol}://${req.get('host')}/payment-cancel`,
            customer_email: customer.email,
            client_reference_id: customer.id,
            mode: 'payment',
            line_items: lineItems

        });


        if (!session) {
            return res.status(500).json({
                success: false,
                message: 'Failed to create Stripe session',
            });
        }



        const order = await new Order({
            customerId: customer.id,
            address: address,
            grandTotal: grandTotal,
            session: session.id,
            deliveryFee: deliveryFee,
            cartData: cart.map(item => ({ id: item._id, productName: item.productName, customerName: item.customerName, avatar: item.avatar, productQty: item.productQty, subTotal: item.subTotal, productSizePrice: item.productSizePrice, productSizeName: item.productSizeName })),
        }).save();

        const removeCart = await Cart.deleteMany({});

        return res.status(200).json({
            order,
            session
        });




    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};


exports.allOrder = async (req, res) => {
    try {

        const data = await Order.find().populate('customerId');

        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


exports.orderDetails = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await Order.findById(id);

        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


exports.deleteOrder = async (req, res) => {
    try {

        const orderId = req.params.id;

        const data = await Order.findOneAndDelete({ _id: orderId })

        if (!data) {
            return res.status(401).json({
                message: 'No data found'
            })
        }

        return res.status(200).json({
            message: 'Data deleted successfully'
        })

    } catch (error) {
        return (error)
    }
}

exports.allCustomerAddress = async (req, res) => {
    try {

        const data = await Address.find();
        res.status(200).json(data)

    } catch (error) {
        return (error)
    }
}

exports.allCustomer = async (req, res) => {
    try {

        const data = await Customer.find();
        res.status(200).json(data)

    } catch (error) {
        return (error)
    }
}

exports.orderStatus = async (req, res) => {
    try {
        const orderId = req.params.id
        const { orderStatus } = req.body
        console.log(orderStatus)

        const data = await Order.findByIdAndUpdate(orderId, { orderStatus: orderStatus }, { new: true })

        res.status(200).json(data)

    } catch (error) {
        return (error)
    }
}

exports.specificCustomerOrder = async (req, res) => {
    try {
        const customerId = req.params.id

        const data = await Order.find({ customerId: customerId })

        res.status(200).json(data)

    } catch (error) {
        return (error)
    }
}

exports.specificCustomerDelivery = async (req, res) => {
    try {
        const customerId = req.params.id

        const data = await Order.find({ customerId: customerId, orderStatus: "Deliverd" })

        res.status(200).json(data)

    } catch (error) {
        return (error)
    }
}

exports.orderHistory = async (req, res) => {
    try {
        let total = 0; // Initialize total with a default value

        const totalOrder = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$grandTotal" }
                }
            }
        ]);

        if (totalOrder.length > 0) {
            // Access the total from the first object in the array
            total = totalOrder[0].total;
        }

        const orderCount = await Order.countDocuments();


        let customer = 0;

        const customerCount = await Order.aggregate([
            {
                $group: {
                    _id: "$customerId"
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 }
                }
            }
        ]);

        if (customerCount.length > 0) {
            customer = customerCount[0].count;
        }

        //Number of Product Name

        const productNameCount = await Order.aggregate([
            {
                $unwind: "$cartData" // Deconstructs the cartData array
            },
            {
                $group: {
                    _id: "$cartData.productName" // Group by product name
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 } // Count the number of unique product names
                }
            }
        ]);

        let count = 0;
        if (productNameCount.length > 0) {
            count = productNameCount[0].count;
        }

        //monthly order Data

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);

        const orderData = await Order.find({
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        });

        





        return res.status(200).json({
            total,
            order: orderCount,
            customer: customer,
            product: count,
            orderData
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}










